import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  ACBInitiateQRCodeRequestDto,
  ACBInitiateQRCodeResponseDto,
  ACBTokenRequestDto,
  ACBTokenResponseDto,
} from './acb-connector.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { SystemConfigKey } from 'src/system-config/system-config.constant';

@Injectable()
export class ACBConnectorClient implements OnModuleInit {
  private acbApiUrl: string;
  private authAcbApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private readonly systemConfigService: SystemConfigService,
  ) {}

  async onModuleInit() {
    const context = `${ACBConnectorClient.name}.${this.onModuleInit.name}`;
    this.setAcbApiUrl();
    this.setAuthAcbApiUrl();
    this.logger.log(`ACB API URL loaded: ${this.acbApiUrl}`, context);
    this.logger.log(`Auth ACB API URL loaded: ${this.authAcbApiUrl}`, context);
  }

  async setAuthAcbApiUrl() {
    this.authAcbApiUrl = await this.systemConfigService.get(
      SystemConfigKey.AUTH_ACB_API_URL,
    );
  }

  async getAuthAcbApiUrl() {
    const context = `${ACBConnectorClient.name}.${this.getAuthAcbApiUrl.name}`;
    if (!this.authAcbApiUrl) {
      this.logger.log(`Auth ACB API URL is not loaded`, context);
      this.setAuthAcbApiUrl();
    }
    return this.authAcbApiUrl;
  }

  async setAcbApiUrl() {
    this.authAcbApiUrl = await this.systemConfigService.get(
      SystemConfigKey.ACB_API_URL,
    );
  }

  async getAcbApiUrl() {
    const context = `${ACBConnectorClient.name}.${this.getAcbApiUrl.name}`;
    if (!this.acbApiUrl) {
      this.logger.log(`ACB API URL is not loaded`, context);
      this.setAcbApiUrl();
    }
    return this.acbApiUrl;
  }

  /**
   * Get token from ACB API
   * @param {ACBTokenRequestDto} requestData
   * @returns {Promise<ACBTokenResponseDto>}
   */
  async token(requestData: ACBTokenRequestDto): Promise<ACBTokenResponseDto> {
    const context = `${ACBConnectorClient.name}.${this.token.name}`;
    const requestUrl = `${await this.getAuthAcbApiUrl()}/auth/realms/soba/protocol/openid-connect/token`;
    const { data } = await firstValueFrom(
      this.httpService
        .post<ACBTokenResponseDto>(requestUrl, requestData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Get token from ACB API failed: ${JSON.stringify(error.response?.data)}`,
              context,
            );
            throw new BadRequestException(error.message);
          }),
        ),
    );
    this.logger.log(`Get token from ACB API success`, context);
    return data;
  }

  /**
   * Initiate QR Code from ACB API
   * @param {any} headers Headers for request
   * @param {ACBInitiateQRCodeRequestDto} requestData Request data for initiate QR Code
   * @param {string} accessToken Access token from ACB API
   * @returns {Promise<ACBInitiateQRCodeResponseDto>} Result of initiate QR Code
   */
  async initiateQRCode(
    headers: any,
    requestData: ACBInitiateQRCodeRequestDto,
    accessToken: string,
  ): Promise<ACBInitiateQRCodeResponseDto> {
    const context = `${ACBConnectorClient.name}.${this.initiateQRCode.name}`;
    const requestUrl = `${await this.getAcbApiUrl()}/payments/qr-payment/v1/initiate`;
    const { data } = await firstValueFrom(
      this.httpService
        .post<ACBInitiateQRCodeResponseDto>(requestUrl, requestData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...headers,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Init QR Code from ACB API failed: ${JSON.stringify(error)}`,
              context,
            );
            throw new BadRequestException(error.message);
          }),
        ),
    );
    return data;
  }

  async retrieveQRCode() {}
}

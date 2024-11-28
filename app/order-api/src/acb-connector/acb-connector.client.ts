import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ACBInitiateQRCodeRequestDto,
  ACBInitiateQRCodeResponseDto,
  ACBTokenRequestDto,
  ACBTokenResponseDto,
} from './acb-connector.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ACBConnectorClient {
  private readonly acbApiUrl: string =
    this.configService.get<string>('ACB_API_URL');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  /**
   * Get token from ACB API
   * @param {ACBTokenRequestDto} requestData
   * @returns {Promise<ACBTokenResponseDto>}
   */
  async token(requestData: ACBTokenRequestDto): Promise<ACBTokenResponseDto> {
    const context = `${ACBConnectorClient.name}.${this.token.name}`;
    const requestUrl = `${this.acbApiUrl}/iam/id/v1/auth/realms/soba/protocol/openid-connect/token`;
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
    const requestUrl = `${this.acbApiUrl}/payments/qr-payment/v1/initiate`;
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
              `Init QR Code from ACB API failed: ${JSON.stringify(error.response?.data)}`,
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

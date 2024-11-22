import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
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
  // private readonly clientId: string =
  //   this.configService.get<string>('CLIENT_ID');
  // private readonly clientSecret: string =
  //   this.configService.get<string>('CLIENT_SECRET');

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
              `Get token from ACB API failed: ${error.message}`,
            );
            throw error;
          }),
        ),
    );
    this.logger.log(`Get token from ACB API success`);
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
              `Init QR Code from ACB API failed: ${error.message}`,
            );
            throw error;
          }),
        ),
    );
    return data;
  }

  async retrieveQRCode() {}
}

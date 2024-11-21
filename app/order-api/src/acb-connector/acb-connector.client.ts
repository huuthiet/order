import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ACBConnectorClient {
  private readonly acbApiUrl: string =
    this.configService.get<string>('ACB_API_URL');
  private readonly clientId: string =
    this.configService.get<string>('CLIENT_ID');
  private readonly clientSecret: string =
    this.configService.get<string>('CLIENT_SECRET');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  token() {}

  initiateQRCode() {}

  retrieveQRCode() {}
}

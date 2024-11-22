import { AutoMap } from '@automapper/classes';
import {
  ApiProperty,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { BaseResponseDto } from 'src/app/base.dto';

export class ACBTokenResponseDto {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: string;
  session_state: string;
  scope: string;
}

export class ACBTokenRequestDto {
  client_id: string;
  client_secret: string;
  grant_type: string;
  scope?: string;
}

export class ACBInitiateQRCodeRequestDto {
  requestTrace: string;
  requestDateTime: string;
  requestParameters: ACBInitiateQRCodeRequestParametersDto;
}

export class ACBInitiateQRCodeRequestParametersDto {
  traceNumber: string;
  merchantId: string;
  terminalId: string;
  userId: string;
  orderId: string;
  virtualAccountPrefix: string;
  beneficiaryName: string;
  amount: number;
  voucherCode: string;
  loyaltyCode: string;
}

export class CreateACBConnectorConfigRequestDto {
  @AutoMap()
  @ApiProperty()
  xProviderId: string;

  @AutoMap()
  @ApiProperty()
  xService: string;

  @AutoMap()
  @ApiProperty()
  xOwnerNumber: string;

  @AutoMap()
  @ApiProperty()
  xOwnerType: string;

  @AutoMap()
  @ApiProperty()
  beneficiaryName: string;

  @AutoMap()
  @ApiProperty()
  virtualAccountPrefix: string;
}

export class UpdateACBConnectorConfigRequestDto extends PartialType(
  CreateACBConnectorConfigRequestDto,
) {}

export class ACBInitiateQRCodeResponseDto {
  requestTrace: string;
  responseDateTime: string;
  responseStatus: ACBInitiateQRCodeResponseStatusDto;
  responseBody: ACBInitiateQRCodeResponseBodyDto;
}

export class ACBInitiateQRCodeResponseBodyDto {
  virtualAccount: string;
  traceNumber: string;
  qrDataUrl: string;
}

export class ACBInitiateQRCodeResponseStatusDto {
  responseCode: string;
  responseMessage: string;
}

export class ACBConnectorConfigResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty()
  xProviderId: string;

  @AutoMap()
  @ApiProperty()
  xService: string;

  @AutoMap()
  @ApiProperty()
  xOwnerNumber: string;

  @AutoMap()
  @ApiProperty()
  xOwnerType: string;

  @AutoMap()
  @ApiProperty()
  beneficiaryName: string;

  @AutoMap()
  @ApiProperty()
  virtualAccountPrefix: string;
}

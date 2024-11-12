import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionStatusRequestDto {
  @ApiProperty()
  requestTrace: string;

  @ApiProperty()
  responseDateTime: string;

  @ApiProperty()
  responseStatus: {
    responseCode: string;
    responseMessage: string;
  };

  @ApiProperty()
  responseBody: {
    index: string;
    referenceCode: string;
  };
}

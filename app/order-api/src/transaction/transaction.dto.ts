import { ApiProperty } from '@nestjs/swagger';
import {
  ACBResponseBodyDto,
  ACBResponseStatusDto,
} from 'src/acb-connector/acb-connector.dto';

export class UpdateTransactionStatusRequestDto {
  @ApiProperty()
  requestTrace: string;

  @ApiProperty()
  responseDateTime: string;

  @ApiProperty()
  requestParameters: {
    masterMeta: {
      clientId: string;
      clientRequestId: string;
    };
    request: {
      requestMeta: {
        requestType: string;
        requestCode: string;
      };
      requestParams: {
        transactions: [
          {
            transactionStatus: string;
            effectiveDate: string;
            amount: number;
            transactionEntityAttribute: {
              traceNumber: string;
            };
          },
        ];
      };
    };
  };
}

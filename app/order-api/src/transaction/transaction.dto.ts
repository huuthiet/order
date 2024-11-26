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
  responseStatus: ACBResponseStatusDto;

  @ApiProperty()
  responseBody: ACBResponseBodyDto;
}

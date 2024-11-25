import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { UpdateTransactionStatusRequestDto } from './transaction.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';

@Controller('transaction')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('callback')
  @Public()
  async statusCallback(
    @Body(new ValidationPipe({ transform: true }))
    requestData: UpdateTransactionStatusRequestDto,
  ) {
    return this.transactionService.callback(requestData);
  }

  // @Post('status/callback')
  // async statusCallback(
  //   @Body(ValidationPipe) requestData: UpdateTransactionStatusRequestDto,
  // ) {
  //   return this.transactionService.callback(requestData);
  // }

  // @Post('qr-transaction/callback')
  // async qrTransactionCallback(
  //   @Body(ValidationPipe) requestData: UpdateTransactionStatusRequestDto,
  // ) {
  //   return this.transactionService.callback(requestData);
  // }
}

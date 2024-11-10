import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { UpdateTransactionStatusRequestDto } from './transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/callback')
  async callback(
    @Body(ValidationPipe) requestData: UpdateTransactionStatusRequestDto,
  ) {
    return this.transactionService.callback(requestData);
  }
}

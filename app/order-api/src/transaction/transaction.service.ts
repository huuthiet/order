import { Injectable, Logger } from '@nestjs/common';
import { UpdateTransactionStatusRequestDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  async callback(requestData: UpdateTransactionStatusRequestDto) {
    const context = `${TransactionService.name}.${this.callback.name}`;
    console.log({ context, requestData });
    this.logger.warn('Callback request received', context);
    return 'ok';
  }
}

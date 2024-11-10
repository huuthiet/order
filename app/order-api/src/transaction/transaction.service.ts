import { Injectable, Logger } from '@nestjs/common';
import { UpdateTransactionStatusRequestDto } from './transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  async callback(requestData: UpdateTransactionStatusRequestDto) {
    this.logger.warn('Callback request received', requestData);
    return 'ok';
  }
}

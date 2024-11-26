import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateTransactionStatusRequestDto } from './transaction.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async callback(requestData: UpdateTransactionStatusRequestDto) {
    const context = `${TransactionService.name}.${this.callback.name}`;
    const json = JSON.stringify(requestData);
    console.log({ context, json });
    this.logger.warn('Callback request received', context);
    return 'ok';
  }
}

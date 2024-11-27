import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PaymentService } from 'src/payment/payment.service';
import { ACBStatusRequestDto } from 'src/acb-connector/acb-connector.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly payementService: PaymentService,
  ) {}

  async callback(requestData: ACBStatusRequestDto) {
    const context = `${TransactionService.name}.${this.callback.name}`;
    const json = JSON.stringify(requestData);
    this.logger.warn(`Callback request received: ${json}`, context);
    return this.payementService.callback(requestData);
  }
}

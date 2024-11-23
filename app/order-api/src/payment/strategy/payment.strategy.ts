import { InitiatePaymentQRCodeResponseDto } from '../payment.dto';
import { Payment } from '../payment.entity';

export interface IPaymentStrategy {
  process(order: any): Promise<InitiatePaymentQRCodeResponseDto>;
}

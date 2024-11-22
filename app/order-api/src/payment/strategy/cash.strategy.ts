import { Injectable } from '@nestjs/common';
import { IPaymentStrategy } from './payment.strategy';
import { InitiatePaymentQRCodeResponseDto } from '../payment.dto';

@Injectable()
export class CashStrategy implements IPaymentStrategy {
  async process(order: any): Promise<InitiatePaymentQRCodeResponseDto> {
    throw new Error('Method not implemented.');
  }
}

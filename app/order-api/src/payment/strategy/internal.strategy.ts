import { Injectable } from '@nestjs/common';
import { Payment } from '../payment.entity';
import { IPaymentStrategy } from './payment.strategy';
import { InitiatePaymentQRCodeResponseDto } from '../payment.dto';

@Injectable()
export class InternalStrategy implements IPaymentStrategy {
  async process(order: any): Promise<InitiatePaymentQRCodeResponseDto> {
    throw new Error('Method not implemented.');
  }
}

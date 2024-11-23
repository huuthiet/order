import { Injectable } from '@nestjs/common';
import { IPaymentStrategy } from './payment.strategy';
import { Payment } from '../payment.entity';

@Injectable()
export class CashStrategy implements IPaymentStrategy {
  async process(order: any): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
}

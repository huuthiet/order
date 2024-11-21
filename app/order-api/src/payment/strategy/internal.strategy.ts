import { Injectable } from '@nestjs/common';
import { Payment } from '../payment.entity';
import { IPaymentStrategy } from './payment.strategy';

@Injectable()
export class InternalStrategy implements IPaymentStrategy {
  process(order: any): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
}

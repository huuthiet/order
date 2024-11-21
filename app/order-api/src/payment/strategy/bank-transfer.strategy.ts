import { Injectable } from '@nestjs/common';
import { Payment } from '../payment.entity';
import { IPaymentStrategy } from './payment.strategy';

@Injectable()
export class BankTransferStrategy implements IPaymentStrategy {
  // constructor() {

  // }
  process(order: any): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
}

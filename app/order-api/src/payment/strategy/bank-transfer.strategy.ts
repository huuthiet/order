import { Injectable } from '@nestjs/common';
import { Payment } from '../payment.entity';
import { IPaymentStrategy } from './payment.strategy';
import { ACBConnectorClient } from 'src/acb-connector/acb-connector.client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BankTransferStrategy implements IPaymentStrategy {
  constructor(
    private readonly acbConnectorClient: ACBConnectorClient,
    private readonly configService: ConfigService,
  ) {}

  async process(order: any): Promise<Payment> {
    throw new Error('Method not implemented.');
    // Get token from ACB

    // Call ACB API to create payment
  }
}

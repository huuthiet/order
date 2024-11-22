import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { CashStrategy } from './strategy/cash.strategy';
import { BankTransferStrategy } from './strategy/bank-transfer.strategy';
import { InternalStrategy } from './strategy/internal.strategy';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  CreatePaymentDto,
  InitiatePaymentQRCodeResponseDto,
} from './payment.dto';
import { Order } from 'src/order/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private readonly cashStrategy: CashStrategy,
    private readonly bankTransferStrategy: BankTransferStrategy,
    private readonly internalStrategy: InternalStrategy,
  ) {}
  async initiateQRCode(createPaymentDto: CreatePaymentDto) {
    const context = `${PaymentService.name}.${this.initiateQRCode.name}`;
    // get order
    const order = await this.orderRepository.findOne({
      where: { slug: createPaymentDto.orderSlug },
    });
    if (!order) {
      this.logger.error('Order not found', context);
      throw new Error('Order not found');
    }

    let result: InitiatePaymentQRCodeResponseDto;

    switch (createPaymentDto.paymentMethod) {
      case 'bank-transfer':
        result = await this.bankTransferStrategy.process(order);
        break;
      // case 'internal':
      //   result = await this.internalStrategy.process({});
      //   break;
      default:
        this.logger.error('Invalid payment method');
        throw new Error('Invalid payment method');
    }
    return result;
  }
}

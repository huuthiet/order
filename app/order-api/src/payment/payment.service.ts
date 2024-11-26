import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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
  CallbackUpdatePaymentStatusRequestDto,
  CreatePaymentDto,
  GetSpecificPaymentRequestDto,
  PaymentResponseDto,
} from './payment.dto';
import { Order } from 'src/order/order.entity';
import * as _ from 'lodash';
import { PaymentException } from './payment.exception';
import { PaymentValidation } from './payment.validation';
import { PaymentMethod } from './payment.constants';

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

  /**
   * Get specific payment
   * @param {GetSpecificPaymentRequestDto} query
   * @returns {Promise<PaymentResponseDto>} payment
   */
  async getSpecific(
    query: GetSpecificPaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    if (_.isEmpty(query)) {
      throw new PaymentException(PaymentValidation.PAYMENT_QUERY_INVALID);
    }
    const payment = await this.paymentRepository.findOne({
      where: { transactionId: query.transaction },
    });
    return this.mapper.map(payment, Payment, PaymentResponseDto);
  }

  /**
   * Initiate payment
   * @param {CreatePaymentDto} createPaymentDto
   * @returns {Promise<PaymentResponseDto>} payment
   */
  async initiate(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const context = `${PaymentService.name}.${this.initiate.name}`;
    // get order
    const order = await this.orderRepository.findOne({
      where: { slug: createPaymentDto.orderSlug },
      relations: ['owner'],
    });
    if (!order) {
      this.logger.error('Order not found', context);
      throw new BadRequestException('Order not found');
    }

    let payment: Payment;

    switch (createPaymentDto.paymentMethod) {
      case PaymentMethod.BANK_TRANSFER:
        payment = await this.bankTransferStrategy.process(order);
        break;
      case PaymentMethod.CASH:
        payment = await this.cashStrategy.process(order);
        break;
      default:
        this.logger.error('Invalid payment method');
        throw new PaymentException(PaymentValidation.PAYMENT_METHOD_INVALID);
    }

    // Update order
    Object.assign(order, {
      payment,
    });
    await this.orderRepository.save(order);

    return this.mapper.map(payment, Payment, PaymentResponseDto);
  }

  /**
   * Callback update payment status
   * @param {CallbackUpdatePaymentStatusRequestDto} requestData
   * @returns {Promise<PaymentResponseDto>} payment
   * @throws {PaymentException}
   */
  async callback(
    requestData: CallbackUpdatePaymentStatusRequestDto,
  ): Promise<PaymentResponseDto> {
    const context = `${PaymentService.name}.${this.callback.name}`;
    const payment = await this.paymentRepository.findOne({
      where: { transactionId: requestData.requestTrace },
    });

    if (!payment) {
      this.logger.error('Payment not found', context);
      throw new PaymentException(PaymentValidation.PAYMENT_NOT_FOUND);
    }

    // update payment status
    Object.assign(payment, {
      statusCode: requestData.responseStatus.responseCode,
      statusMessage: requestData.responseStatus.responseMessage,
    });

    const updatedPayment = await this.paymentRepository.save(payment);
    this.logger.log(`Payment ${updatedPayment.id}`, context);
    return this.mapper.map(updatedPayment, Payment, PaymentResponseDto);
  }
}

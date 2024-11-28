import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  CreateInvoiceDto,
  GetSpecificInvoiceRequestDto,
  InvoiceResponseDto,
} from './invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/order/order.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { OrderException } from 'src/order/order.exception';
import { OrderValidation } from 'src/order/order.validation';
import { InvoiceItem } from 'src/invoice-item/invoice-item.entity';
import * as _ from 'lodash';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const context = `${InvoiceService.name}.${this.create.name}`;
    const order = await this.orderRepository.findOne({
      where: { slug: createInvoiceDto.order },
      relations: [
        'invoice.invoiceItems',
        'payment',
        'owner',
        'branch',
        'orderItems.variant.product',
        'orderItems.variant.size',
        'approvalBy',
      ],
    });
    if (!order) {
      this.logger.warn(`Order ${createInvoiceDto.order} not found`, context);
      throw new OrderException(OrderValidation.ORDER_NOT_FOUND);
    }

    // invoice exists
    if (order.invoice) {
      this.logger.warn(
        `Invoice for order ${createInvoiceDto.order} already exists`,
        context,
      );
      return this.mapper.map(order.invoice, Invoice, InvoiceResponseDto);
    }

    const invoice = {
      order,
      logo: 'https://i.imgur',
      amount: order.subtotal,
      paymentMethod: order.payment?.paymentMethod,
      status: order.status,
      tableName: order.tableName,
      customer: `${order.owner.firstName} ${order.owner.lastName}`,
      branchAddress: order.branch.address,
      cashier: `${order.approvalBy?.firstName} ${order.approvalBy?.lastName}`,
    } as Invoice;

    const invoiceItems = order.orderItems.map((item) => {
      return {
        productName: item.variant.product.name,
        quantity: item.quantity,
        price: item.variant.price,
        total: item.subtotal,
        size: item.variant.size.name,
      } as InvoiceItem;
    });

    invoice.invoiceItems = invoiceItems;
    await this.invoiceRepository.manager.transaction(async (manager) => {
      await manager.insert(Invoice, invoice);
    });
    console.log({ invoice });

    this.logger.log(
      `Invoice ${invoice.id} created for order ${order.id}`,
      context,
    );

    return this.mapper.map(invoice, Invoice, InvoiceResponseDto);
  }

  async getSpecificInvoice(query: GetSpecificInvoiceRequestDto) {
    if (_.isEmpty(query))
      throw new BadRequestException('Query parameters are required');
    // throw new OrderException(OrderValidation.INVALID_QUERY);

    const invoice = await this.invoiceRepository.findOne({
      where: {
        order: { slug: query.order },
        slug: query.slug,
      },
      relations: ['invoiceItems'],
    });

    return this.mapper.map(invoice, Invoice, InvoiceResponseDto);
  }
}

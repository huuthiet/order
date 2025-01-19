import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Order } from 'src/order/order.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  CreateOrderItemRequestDto,
  OrderItemResponseDto,
} from './order-item.dto';
import { Variant } from 'src/variant/variant.entity';
import { OrderException } from 'src/order/order.exception';
import { OrderValidation } from 'src/order/order.validation';
import { VariantException } from 'src/variant/variant.exception';
import { VariantValidation } from 'src/variant/variant.validation';
import { TransactionManagerService } from 'src/db/transaction-manager.service';
import { OrderItemException } from './order-item.exception';
import { OrderItemValidation } from './order-item.validation';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly transactionManagerService: TransactionManagerService,
  ) {}

  async deleteOrderItem(slug: string) {
    const context = `${OrderItemService.name}.${this.deleteOrderItem.name}`;
    const orderItem = await this.getOrderItem({ slug });
    await this.transactionManagerService.execute(
      async (manager) => {
        await manager.remove(orderItem);
      },
      () => {
        this.logger.log(`Order item deleted: ${slug}`, context);
      },
      (error) => {
        this.logger.error(
          `Error when deleting order item: ${error.message}`,
          error.stack,
          context,
        );
      },
    );
  }

  async getOrder(where: FindOptionsWhere<Order>) {
    const order = await this.orderRepository.findOne({
      where,
      relations: ['orderItems', 'orderItems.variant'],
    });
    if (!order) {
      throw new OrderException(OrderValidation.ORDER_NOT_FOUND);
    }
    return order;
  }

  async getOrderItem(where: FindOptionsWhere<OrderItem>) {
    const orderItem = await this.orderItemRepository.findOne({
      where,
    });
    if (!orderItem) {
      throw new OrderItemException(OrderItemValidation.ORDER_ITEM_NOT_FOUND);
    }
    return orderItem;
  }

  async getVariant(where: FindOptionsWhere<Variant>) {
    const variant = await this.variantRepository.findOne({
      where,
    });
    if (!variant) {
      throw new VariantException(VariantValidation.VARIANT_NOT_FOUND);
    }
    return variant;
  }

  async calculateSubTotal(orderItem: OrderItem) {
    return orderItem.quantity * orderItem.variant.price;
  }

  async createOrderItem(requestData: CreateOrderItemRequestDto) {
    const context = `${OrderItemService.name}.${this.createOrderItem.name}`;
    const order = await this.getOrder({ slug: requestData.order });
    const variant = await this.getVariant({ slug: requestData.variant });
    const orderItem = this.mapper.map(
      requestData,
      CreateOrderItemRequestDto,
      OrderItem,
    );
    orderItem.variant = variant;
    orderItem.order = order;
    orderItem.subtotal = await this.calculateSubTotal(orderItem);
    order.orderItems.push(orderItem);

    const createdOrderItem =
      await this.transactionManagerService.execute<OrderItem>(
        async (manager) => {
          const created = await manager.save(orderItem);
          await manager.save(order);
          return created;
        },
        (result) => {
          this.logger.log(`Order item created: ${result.id}`, context);
        },
        (error) => {
          this.logger.error(
            `Error when creating order item: ${error.mesage}`,
            error.stack,
            context,
          );
        },
      );

    return this.mapper.map(createdOrderItem, OrderItem, OrderItemResponseDto);
  }
}

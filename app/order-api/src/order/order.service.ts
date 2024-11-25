import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import {
  CreateOrderRequestDto,
  GetOrderRequestDto,
  GetSpecificOrderRequestDto,
  OrderResponseDto,
} from './order.dto';
import { OrderItem } from 'src/order-item/order-item.entity';
import { CreateOrderItemRequestDto } from 'src/order-item/order-item.dto';
import { Table } from 'src/table/table.entity';
import { Branch } from 'src/branch/branch.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { User } from 'src/user/user.entity';
import { Variant } from 'src/variant/variant.entity';
import { OrderType } from './order.contants';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async createOrder(
    requestData: CreateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    const context = `${OrderService.name}.${this.createOrder.name}`;
    const checkValidOrderData = await this.checkDataCreateOrder(requestData);
    if (!checkValidOrderData.isValid) {
      this.logger.warn(checkValidOrderData.message, context);
      throw new BadRequestException(checkValidOrderData.message);
    }
    const checkValidOrderItemData = await this.checkDataCreateOrderItem(
      requestData.orderItems,
    );
    if (!checkValidOrderItemData.isValid) {
      this.logger.warn('Invalid order item data', context);
      throw new BadRequestException('Invalid order item data');
    }

    const mappedOrder = checkValidOrderData.mappedOrder;
    Object.assign(mappedOrder, {
      orderItems: checkValidOrderItemData.mappedOrderItems,
      subtotal: checkValidOrderItemData.subtotal,
    });

    const newOrder = this.orderRepository.create(mappedOrder);
    const createdOrder = await this.orderRepository.save(newOrder);
    this.logger.log(
      `Create new order ${createdOrder.slug} successfully`,
      context,
    );
    const orderDto = this.mapper.map(createdOrder, Order, OrderResponseDto);
    return orderDto;
  }

  async checkDataCreateOrder(data: CreateOrderRequestDto): Promise<{
    isValid: Boolean;
    message?: string;
    mappedOrder?: Order;
  }> {
    const branch = await this.branchRepository.findOneBy({ slug: data.branch });
    if (!branch)
      return {
        isValid: false,
        message: 'Branch is not found',
      };

    const checkTable = await this.checkTypeOrder(
      data.table,
      data.branch,
      data.type === OrderType.AT_TABLE
        ? OrderType.AT_TABLE
        : OrderType.TAKE_OUT,
    );
    if (!checkTable.isValid)
      return {
        isValid: false,
        message: 'Table is not found in this branch',
      };

    const owner = await this.userRepository.findOneBy({ slug: data.owner });
    if (!owner)
      return {
        isValid: false,
        message: 'The owner is not found',
      };

    const order = this.mapper.map(data, CreateOrderRequestDto, Order);
    Object.assign(order, {
      owner: owner,
      branch: branch,
      tableName:
        data.type === OrderType.AT_TABLE ? checkTable.taleData.name : null,
    });
    return { isValid: true, mappedOrder: order };
  }

  async checkTypeOrder(
    tableSlug: string,
    branchSlug: string,
    type: OrderType,
  ): Promise<{ isValid: Boolean; taleData: Table }> {
    if (type === OrderType.TAKE_OUT) return { isValid: true, taleData: null };

    const table = await this.tableRepository.findOne({
      where: {
        slug: tableSlug,
        branch: {
          slug: branchSlug,
        },
      },
    });
    if (!table) return { isValid: false, taleData: null };
    return { isValid: true, taleData: table };
  }

  async checkDataCreateOrderItem(data: CreateOrderItemRequestDto[]): Promise<{
    isValid: Boolean;
    mappedOrderItems?: OrderItem[];
    subtotal?: number;
  }> {
    if (data.length < 1) return { isValid: false };

    let subtotal: number = 0;
    const mappedOrderItems: OrderItem[] = [];
    for (let i = 0; i < data.length; i++) {
      let variant = await this.variantRepository.findOneBy({
        slug: data[i].variant,
      });
      if (!variant) return { isValid: false };
      subtotal += variant.price * data[i].quantity;
      const mappedOrderItem = this.mapper.map(
        data[i],
        CreateOrderItemRequestDto,
        OrderItem,
      );
      Object.assign(mappedOrderItem, {
        variant,
        subtotal: variant.price * data[i].quantity,
      });
      mappedOrderItems.push(mappedOrderItem);
    }

    return { isValid: true, mappedOrderItems, subtotal };
  }

  async getAllOrders(options: GetOrderRequestDto): Promise<OrderResponseDto[]> {
    const context = `${OrderService.name}.${this.getAllOrders.name}`;
    const orders = await this.orderRepository.find({
      where: {
        branch: {
          slug: options.branch,
        },
        owner: {
          slug: options.owner,
        },
      },
      relations: [
        'owner',
        'orderItems.variant.size',
        'orderItems.variant.product',
        'payment',
      ],
    });

    const ordersDto = this.mapper.mapArray(orders, Order, OrderResponseDto);
    this.logger.log(`Get all orders successfully`, context);

    return ordersDto;
  }

  async getOrderBySlug(slug: string): Promise<OrderResponseDto> {
    const context = `${OrderService.name}.${this.getOrderBySlug.name}`;
    const order = await this.orderRepository.findOne({
      where: { slug },
      relations: [
        'owner',
        'orderItems.variant.size',
        'orderItems.variant.product',
        'payment',
      ],
    });

    if (!order) {
      this.logger.warn(`Order ${slug} not found`, context);
      throw new BadRequestException('Order is not found');
    }

    const orderDto = this.mapper.map(order, Order, OrderResponseDto);
    this.logger.log(`Get order by slug ${slug} successfully`, context);
    return orderDto;
  }
}

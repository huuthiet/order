import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DataSource, Repository } from 'typeorm';
import {
  CheckDataCreateOrderItemResponseDto,
  CheckDataCreateOrderResponseDto,
  CreateOrderRequestDto,
  GetOrderRequestDto,
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
import { OrderStatus, OrderType } from './order.contants';
import { WorkFlowStatus } from 'src/tracking/tracking.constants';
import { RobotConnectorClient } from 'src/robot-connector/robot-connector.client';
import { Tracking } from 'src/tracking/tracking.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderException } from './order.exception';
import { OrderValidation } from './order.validation';
import { PaymentStatus } from 'src/payment/payment.constants';

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
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly robotConnectorClient: RobotConnectorClient,
    private readonly dataSource: DataSource,
  ) {}

  @OnEvent('payment.paid')
  async handleUpdateOrderStatus(requestData: { orderId: string }) {
    const context = `${OrderService.name}.${this.handleUpdateOrderStatus.name}`;
    this.logger.log(`Update order status after payment process`, context);

    const order = await this.orderRepository.findOne({
      where: { id: requestData.orderId },
      relations: ['payment'],
    });

    if (!order) {
      this.logger.error(`Order not found`, context);
      throw new OrderException(OrderValidation.ORDER_NOT_FOUND);
    }

    if (order.payment?.statusCode === PaymentStatus.COMPLETED) {
      Object.assign(order, { status: OrderStatus.PAID });
      await this.orderRepository.save(order);
      this.logger.log(`Update order status to PAID`, context);
    }
  }

  /**
   *
   * @param {CreateOrderRequestDto} requestData The data to create a new order
   * @returns {Promise<OrderResponseDto>} The created order
   * @throws {BadRequestException} If branch is not found
   * @throws {BadRequestException} If table is not found in this branch
   * @throws {BadRequestException} If invalid data to create order item
   */
  async createOrder(
    requestData: CreateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    const context = `${OrderService.name}.${this.createOrder.name}`;
    const mappedOrder: Order = await this.validateCreatedOrderData(requestData);

    const checkValidOrderItemData = await this.checkCreatedOrderItemData(requestData.orderItems);
    if(!checkValidOrderItemData.isValid) {
      this.logger.warn('Invalid order item data', context);
      throw new BadRequestException('Invalid order item data');
    }

    Object.assign(
      mappedOrder, 
      { 
        orderItems: checkValidOrderItemData.mappedOrderItems,
        subtotal: checkValidOrderItemData.subtotal
      }
    );
    
    const newOrder = this.orderRepository.create(mappedOrder);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let createdOrder: Order;
    try {
      createdOrder = await queryRunner.manager.save(newOrder);
      await queryRunner.commitTransaction();
      this.logger.log(
        `Create new order ${createdOrder.slug} successfully`,
        context,
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.warn(
        `Create new order failed`,
        context,
      );
      throw new BadRequestException('Create new order failed')
    } finally {
      await queryRunner.release();
    }
    
    const orderDto = this.mapper.map(createdOrder, Order, OrderResponseDto);
    return orderDto;
  }

  /**
   *
   * @param {CreateOrderRequestDto} data The data to create order
   * @returns {Promise<CheckDataCreateOrderResponseDto>} The result of checking
   */
  async validateCreatedOrderData(
    data: CreateOrderRequestDto
  ): Promise<Order> {
    const context = `${OrderService.name}.${this.validateCreatedOrderData.name}`;
    const branch = await this.branchRepository.findOneBy({ slug: data.branch });
    if (!branch) {
      this.logger.warn(`Branch ${data.branch} is not found`, context);
      throw new BadRequestException('Branch is not found');
    }

    let tableName: string = null; // default for take-out
    if(data.type === OrderType.AT_TABLE) {
      const table = await this.tableRepository.findOne({
        where: {
          slug: data.table,
          branch: {
            slug: data.branch,
          },
        },
      });
      if(!table) {
        this.logger.warn(`Table ${data.table} is not found in this branch`, context);
        throw new BadRequestException('Table is not found in this branch');
      }
      tableName = table.name;
    }

    const owner = await this.userRepository.findOneBy({ slug: data.owner });
    if (!owner) {
      this.logger.warn(`The owner ${data.owner} is not found`, context);
      throw new BadRequestException('The owner is not found');
    }
    const order = this.mapper.map(data, CreateOrderRequestDto, Order);
    Object.assign(order, {
      owner: owner,
      branch: branch,
      tableName,
    })
    return order;
  }

  /**
   *
   * @param {CreateOrderItemRequestDto} data The array of data to create order item
   * @returns {Promise<CheckDataCreateOrderItemResponseDto>} The result of checking
   */
  async checkCreatedOrderItemData(
    data: CreateOrderItemRequestDto[],
  ): Promise<CheckDataCreateOrderItemResponseDto> {
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

  /**
   *
   * @param {GetOrderRequestDto} options The options to retrieved order
   * @returns {Promise<OrderResponseDto>} All orders retrieved
   */
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

  /**
   *
   * @param {string} slug The slug of order retrieved
   * @returns {Promise<OrderResponseDto>} The order data is retrieved
   * @throws {BadRequestException} If order is not found
   */
  async getOrderBySlug(slug: string): Promise<OrderResponseDto> {
    const context = `${OrderService.name}.${this.getOrderBySlug.name}`;
    const order = await this.orderRepository.findOne({
      where: { slug },
      relations: [
        'owner',
        'orderItems.variant.size',
        'orderItems.variant.product',
        'orderItems.trackingOrderItems.tracking',
      ],
    });

    if (!order) {
      this.logger.warn(`Order ${slug} not found`, context);
      throw new BadRequestException('Order is not found');
    }
    await this.updateStatusForTrackingByOrder(order);

    const orderDto = await this.getStatusEachOrderItemInOrder(order);
    const updatedStatus: string = await this.checkAndUpdateStatusOrder(order);
    Object.assign(orderDto, { status: updatedStatus });
    this.logger.log(`Get order by slug ${slug} successfully`, context);
    return orderDto;
  }

  /**
   * Check and update latest status order
   * @param {Order} order The order entity relates to tracking
   * @returns {Promise<string>} The updated status of order
   */
  async checkAndUpdateStatusOrder(
    order: Order
  ): Promise<string> {
    // check by total quantity each order item
    const totalBase = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalQuantities = order.orderItems.reduce(
      (totals, item) => {
        const itemQuantities = item.trackingOrderItems.reduce(
          (statusSums, trackingItem) => {
            const status = trackingItem.tracking.status;
            if (
              status === WorkFlowStatus.COMPLETED ||
              status === WorkFlowStatus.RUNNING
            ) {
              statusSums[status] =
                (statusSums[status] || 0) + trackingItem.quantity;
            }
            return statusSums;
          },
          {} as Record<WorkFlowStatus, number>,
        );
    
        Object.keys(itemQuantities).forEach((status) => {
          totals[status as WorkFlowStatus] =
            (totals[status as WorkFlowStatus] || 0) +
            itemQuantities[status as WorkFlowStatus];
        });

        return totals;
      },
      {} as Record<WorkFlowStatus, number>,
    );

    let defaultStatus: string = order.status;

    if (totalBase > totalQuantities[WorkFlowStatus.COMPLETED]) {
      if (totalQuantities[WorkFlowStatus.RUNNING] > 0) {
        Object.assign(order, { status: OrderStatus.SHIPPING });
        const updatedOrder = await this.orderRepository.save(order);
        defaultStatus = updatedOrder.status;
      }
    } else if (totalBase === totalQuantities[WorkFlowStatus.COMPLETED]) {
      Object.assign(order, { status: OrderStatus.COMPLETED });
      const updatedOrder = await this.orderRepository.save(order);
      defaultStatus = updatedOrder.status;
    }
    return defaultStatus;
  }

  /**
   * Assign status synthesis for each order item in order
   * @param {Order} order The order data relates to tracking
   * @returns {Promise<OrderResponseDto>} The order data with order item have status synthesis
   */
  async getStatusEachOrderItemInOrder(
    order: Order
  ): Promise<OrderResponseDto> {
    const orderItems = order.orderItems.map((item) => {
      const statusQuantities = item.trackingOrderItems.reduce(
        (acc, trackingItem) => {
          const status = trackingItem.tracking.status;

          acc[status] += trackingItem.quantity;
          return acc;
        },
        {
          [WorkFlowStatus.PENDING]: 0,
          [WorkFlowStatus.RUNNING]: 0,
          [WorkFlowStatus.COMPLETED]: 0,
          [WorkFlowStatus.FAILED]: 0,
        },
      );

      return {
        ...item,
        status: statusQuantities,
      };
    });

    const orderDto = this.mapper.map(order, Order, OrderResponseDto);
    Object.assign(orderDto, { orderItems });
    return orderDto;
  }

  /**
   * Get data from robot client and update status for tracking relates to order
   * @param order The order data relates to tracking
   */
  async updateStatusForTrackingByOrder(
    order: Order
  ): Promise<void> {
    const context = `${OrderService.name}.${this.updateStatusForTrackingByOrder.name}`;

    const uniqueWorkFlowInstanceIds = Array.from(
      new Set(
        order.orderItems.flatMap((item) =>
          item.trackingOrderItems.map(
            (trackingItem) => trackingItem.tracking.workFlowInstance,
          ),
        ),
      ),
    );
    
    // if a query fail, it skip, not interrupt
    await Promise.all(
      uniqueWorkFlowInstanceIds.map(async (id) => {
        try {
          const workFlow = await this.robotConnectorClient.retrieveWorkFlowExecution(id);
          
          const tracking = await this.trackingRepository.findOne({
            where: { workFlowInstance: id },
          });
    
          Object.assign(tracking, { status: workFlow.status });
          await this.trackingRepository.save(tracking);
        } catch (error) {
          this.logger.warn(`Error processing workflow instance ${id}`, context);
        }
      })
    );
  }
}

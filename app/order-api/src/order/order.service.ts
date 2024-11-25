import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { Repository } from "typeorm";
import { 
  CheckDataCreateOrderItemResponseDto,
  CheckDataCreateOrderResponseDto, 
  CreateOrderRequestDto, 
  GetOrderRequestDto, 
  OrderResponseDto 
} from "./order.dto";
import { OrderItem } from "src/order-item/order-item.entity";
import { CreateOrderItemRequestDto } from "src/order-item/order-item.dto";
import { Table } from "src/table/table.entity";
import { Branch } from "src/branch/branch.entity";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { User } from "src/user/user.entity";
import { Variant } from "src/variant/variant.entity";
import { OrderStatus, OrderType } from "./order.contants";
import { WorkFlowStatus } from "src/tracking/tracking.constants";
import { RobotConnectorClient } from "src/robot-connector/robot-connector.client";
import { Tracking } from "src/tracking/tracking.entity";

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
  ){}

  /**
   * 
   * @param {CreateOrderRequestDto} requestData The data to create a new order
   * @returns {Promise<OrderResponseDto>} The created order
   * @throws {BadRequestException} If branch is not found
   * @throws {BadRequestException} If table is not found in this branch
   * @throws {BadRequestException} If invalid data to create order item
   */
  async createOrder(
    requestData: CreateOrderRequestDto
  ): Promise<OrderResponseDto> {
    const context = `${OrderService.name}.${this.createOrder.name}`;
    const checkValidOrderData = await this.checkCreatedOrderData(requestData);
    if(!checkValidOrderData.isValid) {
      this.logger.warn(checkValidOrderData.message, context);
      throw new BadRequestException(checkValidOrderData.message);
    }
    const checkValidOrderItemData = await this.checkCreatedOrderItemData(requestData.orderItems);
    if(!checkValidOrderItemData.isValid) {
      this.logger.warn('Invalid order item data', context);
      throw new BadRequestException('Invalid order item data');
    }

    const mappedOrder: Order = checkValidOrderData.mappedOrder;
    Object.assign(
      mappedOrder, 
      { 
        orderItems: checkValidOrderItemData.mappedOrderItems,
        subtotal: checkValidOrderItemData.subtotal
      }
    );
    
    const newOrder = this.orderRepository.create(mappedOrder);
    const createdOrder = await this.orderRepository.save(newOrder);
    this.logger.log(`Create new order ${createdOrder.slug} successfully`, context);
    const orderDto = this.mapper.map(createdOrder, Order, OrderResponseDto);
    return orderDto;
  }

  /**
   * 
   * @param {CreateOrderRequestDto} data The data to create order
   * @returns {Promise<CheckDataCreateOrderResponseDto>} The result of checking
   */
  async checkCreatedOrderData(
    data: CreateOrderRequestDto
  ): Promise<CheckDataCreateOrderResponseDto> {
    const branch = await this.branchRepository.findOneBy({ slug: data.branch });
    if(!branch) return {
      isValid: false,
      message: 'Branch is not found'
    };

    const checkTable = await this.checkOrderType(
      data.table,
      data.branch,
      data.type === OrderType.AT_TABLE ? OrderType.AT_TABLE: OrderType.TAKE_OUT
    );
    if(!checkTable) return {
      isValid: false,
      message: 'Table is not found in this branch'
    };

    const owner = await this.userRepository.findOneBy({ slug: data.owner });
    if(!owner) return {
      isValid: false,
      message: 'The owner is not found'
    }

    const order = this.mapper.map(data, CreateOrderRequestDto, Order);
    Object.assign(order, {
      owner: owner,
      branch: branch,
      tableName: (data.type === OrderType.AT_TABLE ? checkTable.name: null),
    })
    return { isValid: true, mappedOrder: order };
  }

  /**
   * 
   * @param {string} tableSlug The slug of table
   * @param {string} branchSlug The slug of branch 
   * @param {string} type The type of order
   * @returns {Promise<Table | null>} Table data or null
   */
  async checkOrderType(
    tableSlug: string,
    branchSlug: string,
    type: OrderType
  ): Promise<Table | null> {
    if(type === OrderType.TAKE_OUT) return null;
    
    const table = await this.tableRepository.findOne({
      where: {
        slug: tableSlug,
        branch: {
          slug: branchSlug
        }
      }
    });
    if(!table) return null;

    return table;
  }

  /**
   * 
   * @param {CreateOrderItemRequestDto} data The array of data to create order item
   * @returns {Promise<CheckDataCreateOrderItemResponseDto>} The result of checking
   */
  async checkCreatedOrderItemData(
    data: CreateOrderItemRequestDto[]
  ): Promise<CheckDataCreateOrderItemResponseDto> {
    if(data.length < 1) return { isValid: false };

    let subtotal: number = 0;
    const mappedOrderItems: OrderItem[] = [];
    for( let i = 0; i < data.length; i++ ) {
      let variant = await this.variantRepository.findOneBy({ slug: data[i].variant });
      if(!variant) return { isValid: false };
      subtotal += (variant.price * data[i].quantity);
      const mappedOrderItem = this.mapper.map(data[i], CreateOrderItemRequestDto, OrderItem);
      Object.assign(mappedOrderItem, {
        variant,
        subtotal: (variant.price * data[i].quantity)
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
          slug: options.branch
        },
        owner: {
          slug: options.owner
        }
      },
      relations: [
        'owner',
        'orderItems.variant.size',
        'orderItems.variant.product',
      ]
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
    // CẦN GỌI LẠI
    const order = await this.orderRepository.findOne({
      where: { slug },
      relations: [
        'owner',
        'orderItems.variant.size',
        'orderItems.variant.product',
        'orderItems.trackingOrderItems.tracking',
      ]
    });

    if(!order) {
      this.logger.warn(`Order ${slug} not found`, context);
      throw new BadRequestException('Order is not found');
    }
    // await this.updateStatusForTrackingByOrder(order);

    const orderDto  = await this.getStatusEachOrderItemInOrder(order);
    const updatedStatus: string = await this.checkAndUpdateStatusOrder(order);
    Object.assign(orderDto, { status: updatedStatus });
    this.logger.log(`Get order by slug ${slug} successfully`, context);
    return orderDto;
  }

  async checkAndUpdateStatusOrder(
    order: Order
  ): Promise<string> {
    // check by total quantity each order item
    const totalBase = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

    // const totalCompletedQuantity = order.orderItems.reduce((total, item) => {
    //   const completedQuantity = item.trackingOrderItems.reduce((sum, trackingItem) => {
    //     if (trackingItem.tracking.status === WorkFlowStatus.COMPLETED) {
    //       return sum + trackingItem.quantity;
    //     }
    //     return sum;
    //   }, 0);
    //   return total + completedQuantity;
    // }, 0);
    const totalQuantities = order.orderItems.reduce(
      (totals, item) => {
        const itemQuantities = item.trackingOrderItems.reduce(
          (statusSums, trackingItem) => {
            const status = trackingItem.tracking.status;
            if (status === WorkFlowStatus.COMPLETED || status === WorkFlowStatus.RUNNING) {
              statusSums[status] = (statusSums[status] || 0) + trackingItem.quantity;
            }
            return statusSums;
          },
          {} as Record<WorkFlowStatus, number>
        );
    
        // Cộng dồn tổng số lượng từ `item` vào `totals`
        Object.keys(itemQuantities).forEach((status) => {
          totals[status as WorkFlowStatus] =
            (totals[status as WorkFlowStatus] || 0) + itemQuantities[status as WorkFlowStatus];
        });
    
        return totals;
      },
      {} as Record<WorkFlowStatus, number>
    );

    let defaultStatus: string = order.status;

    if(totalBase > totalQuantities[WorkFlowStatus.COMPLETED]) {
      if(totalQuantities[WorkFlowStatus.RUNNING] > 0) {
        Object.assign(order, { status: OrderStatus.SHIPPING })
        const updatedOrder = await this.orderRepository.save(order);
        defaultStatus = updatedOrder.status;
      }
    } else if(totalBase === totalQuantities[WorkFlowStatus.COMPLETED]) {
      Object.assign(order, { status: OrderStatus.COMPLETED })
      const updatedOrder = await this.orderRepository.save(order);
      defaultStatus = updatedOrder.status;
    }
    return defaultStatus;
  }

  async getStatusEachOrderItemInOrder(
    order: Order
  ): Promise<OrderResponseDto> {
    const orderItems = order.orderItems.map((item) => {
      const statusQuantities = item.trackingOrderItems.reduce((acc, trackingItem) => {
        const status = trackingItem.tracking.status;
    
        if (!acc[status]) {
          acc[status] = 0;
        }
    
        acc[status] += trackingItem.quantity;
        return acc;
      }, {});
    
      return {
        ...item,
        status: statusQuantities,
      };
    });

    const orderDto = this.mapper.map(order, Order, OrderResponseDto);
    Object.assign(orderDto, { orderItems })
    return orderDto;
  }

  async updateStatusForTrackingByOrder(
    order: Order
  ): Promise<void> {
    const uniqueWorkFlowInstanceIds = Array.from(
      new Set(
        order.orderItems.flatMap(item =>
          item.trackingOrderItems.map(trackingItem => trackingItem.tracking.workFlowInstance)
        )
      )
    );
    
    for(let i = 0; i < uniqueWorkFlowInstanceIds.length; i++) {
      const workFlow = 
        await this.robotConnectorClient.retrieveWorkFlow(uniqueWorkFlowInstanceIds[i]);
      const tracking = await this.trackingRepository.findOne({
        where: {
          workFlowInstance: uniqueWorkFlowInstanceIds[i]
        }
      });
      Object.assign(tracking, { status: workFlow.status })
      await this.trackingRepository.save(tracking);
    }
  }
}
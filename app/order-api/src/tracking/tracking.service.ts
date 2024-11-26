import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { In, Repository } from "typeorm";
import { Tracking } from "./tracking.entity";
import { CreateTrackingRequestDto, TrackingResponseDto } from "./tracking.dto";
import { CreateTrackingOrderItemRequestDto, CreateTrackingOrderItemWithQuantityAndOrderItemEntity } from "src/tracking-order-item/tracking-order-item.dto";
import { Order } from "src/order/order.entity";
import { OrderItem } from "src/order-item/order-item.entity";
import { TrackingType, WorkFlowStatus } from "./tracking.constants";
import { TrackingOrderItem } from "src/tracking-order-item/tracking-order-item.entity";
import { Table } from 'src/table/table.entity';
import { OrderType } from "src/order/order.contants";
import { RobotConnectorClient } from "src/robot-connector/robot-connector.client";
import { InitiateWorkFlowInstanceRequestDto } from "src/robot-connector/robot-connector.dto";

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
    @InjectRepository(TrackingOrderItem)
    private readonly trackingOrderItemRepository: Repository<TrackingOrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly robotConnectorClient: RobotConnectorClient,
  ) {}

  async createTracking (
    requestData: CreateTrackingRequestDto
  ): Promise<TrackingResponseDto> {
    const context = `${TrackingService.name}.${this.createTracking.name}`;
    const checkDefinedAndQuantityOrderItemResult = await this.checkDefinedAndQuantityOrderItem(
      requestData.trackingOrderItems
    );
    if(!checkDefinedAndQuantityOrderItemResult.isValid) {
      this.logger.warn('Invalid order item data', context);
      throw new BadRequestException('Invalid order item data');
    }
    const checkOrderItemInOneOrderResult = await this.checkOrderItemInOneOrder(requestData.trackingOrderItems);
    if(!checkOrderItemInOneOrderResult) {
      this.logger.warn('All request order items must belong to one order', context);
      throw new BadRequestException('All request order items must belong to one order');
    }

    let savedTrackingId: string = '';
    const orderItemsData = checkDefinedAndQuantityOrderItemResult.orderItemsData;
    if(requestData.type === TrackingType.BY_ROBOT) {
      if(checkOrderItemInOneOrderResult.type === OrderType.TAKE_OUT) {
        this.logger.warn('This order for take out, can not use robot', context);
        throw new BadRequestException('This order for take out, can not use robot');
      }

      const tableLocation: string = await this.getLocationTableByOrder(checkOrderItemInOneOrderResult);
      if(!tableLocation) {
        this.logger.warn('Can not find table location, please check table information', context);
        throw new BadRequestException('Can not find table location, please check table information');
      }
      // CALL WORK FLOW
      // const requestData: InitiateWorkFlowInstanceRequestDto = {
      //   orderCode: checkOrderItemInOneOrderResult.slug,
      //   location: tableLocation
      // }
      // const workFlow = await this.robotConnectorClient.initiateWorkFlowInstance(requestData);

      const workFlowInstanceId = 'work-flow-instance-id';
      const tracking = new Tracking();
      Object.assign(tracking, {
        workFlowInstance: workFlowInstanceId
      });
      const createdTracking = await this.trackingRepository.save(tracking);
      
      // create tracking order item
      
      for(let i = 0; i < orderItemsData.length; i++) {
        let trackingOrderItem = new TrackingOrderItem();
        Object.assign(trackingOrderItem, {
          quantity: orderItemsData[i].quantity,
          orderItem: orderItemsData[i].orderItem,
          tracking: createdTracking
        });
        console.log({trackingOrderItem})

        await this.trackingOrderItemRepository.save(trackingOrderItem);
      }
      savedTrackingId = createdTracking.id;
    }
    if(requestData.type === TrackingType.BY_STAFF) {
      const tracking = new Tracking();
      Object.assign(tracking, { status: WorkFlowStatus.COMPLETED })
      const createdTracking = await this.trackingRepository.save(tracking);
      
      // create tracking order item
      for(let i = 0; i < orderItemsData.length; i++) {
        let trackingOrderItem = new TrackingOrderItem();
        Object.assign(trackingOrderItem, {
          quantity: orderItemsData[i].quantity,
          orderItem: orderItemsData[i].orderItem,
          tracking: createdTracking
        });
        console.log({trackingOrderItem})

        await this.trackingOrderItemRepository.save(trackingOrderItem);
      }

      savedTrackingId = createdTracking.id;
    }

    const trackingData = await this.trackingRepository.findOne({
      where: {
        id: savedTrackingId
      },
      relations: [
        'trackingOrderItems.orderItem'
      ]
    });

    const TrackingDto = this.mapper.map(trackingData, Tracking, TrackingResponseDto);
    return TrackingDto;
  }

  async checkDefinedAndQuantityOrderItem (
    orderItems: CreateTrackingOrderItemRequestDto[]
  ): Promise<{ 
    isValid: Boolean, 
    orderItemsData?: CreateTrackingOrderItemWithQuantityAndOrderItemEntity []
  }> {
    const orderItemsData: CreateTrackingOrderItemWithQuantityAndOrderItemEntity[] = [];
    for(let i = 0; i < orderItems.length; i++) {
      // check defined
      const orderItem = await this.orderItemRepository.findOne({
        where: {
          slug: orderItems[i].orderItem
        }, 
        relations: [
          'order',
          'trackingOrderItems.tracking'
        ]
      });
      if(!orderItem) return { isValid: false };
      if(!orderItem.order) return  { isValid: false };

      orderItemsData.push({
        quantity: orderItems[i].quantity,
        orderItem
      });

      // check quantity

      // order item have not tracking order item
      if(!orderItem.trackingOrderItems) {
        if(orderItems[i].quantity > orderItem.quantity) return { isValid: false };
        else continue;
      }
        
      if(orderItem.trackingOrderItems.length < 1) {
        if(orderItems[i].quantity > orderItem.quantity) return { isValid: false };
        else continue;
      };

      // order item have tracking order item
      const totalCompleted = orderItem.trackingOrderItems.reduce((total, item) => {
        return item.tracking.status ===WorkFlowStatus.COMPLETED ? total + item.quantity : total;
      }, 0);
      if((totalCompleted + orderItems[i].quantity) > orderItem.quantity) return  { isValid: false };
    }
    
    return  { isValid: true, orderItemsData };
  }

  async checkOrderItemInOneOrder (
    orderItems: CreateTrackingOrderItemRequestDto[]
  ): Promise<Order | null> {
    const orderItemSlugs = orderItems.map((item) => item.orderItem);
    const orders = await this.orderRepository.find({
      where: {
        orderItems: {
          slug: In(orderItemSlugs)
        }
      },
      relations: [
        'branch'
      ]
    });
    if(orders.length === 1)
      if(orders[0].branch) return orders[0];

    return null;
  }

  async getLocationTableByOrder (
    order: Order
  ): Promise<string | null> {
    const table = await this.tableRepository.findOne({
      where: {
        name: order.tableName,
        branch: {
          id: order.branch.id
        }
      }
    });
    if(!table) return null;

    return table.location;
  }
}
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { DataSource, In, Repository } from "typeorm";
import { Tracking } from "./tracking.entity";
import { CreateTrackingRequestDto, TrackingResponseDto } from "./tracking.dto";
import { CreateTrackingOrderItemRequestDto, CreateTrackingOrderItemWithQuantityAndOrderItemEntity, ValidateDefinedAndQuantityOrderItem } from "src/tracking-order-item/tracking-order-item.dto";
import { Order } from "src/order/order.entity";
import { OrderItem } from "src/order-item/order-item.entity";
import { TrackingType, WorkFlowStatus } from "./tracking.constants";
import { TrackingOrderItem } from "src/tracking-order-item/tracking-order-item.entity";
import { Table } from 'src/table/table.entity';
import { OrderType } from "src/order/order.contants";
import { RobotConnectorClient } from "src/robot-connector/robot-connector.client";
import { RunWorkFlowRequestDto, WorkFlowExecutionResponseDto } from "src/robot-connector/robot-connector.dto";
import { Workflow } from "src/workflow/workflow.entity";

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
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly robotConnectorClient: RobotConnectorClient,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 
   * @param {CreateTrackingRequestDto} requestData The data to create a new tracking
   * @returns {Promise<TrackingResponseDto>} The created tracking data
   */
  async createTracking (
    requestData: CreateTrackingRequestDto
  ): Promise<TrackingResponseDto> {
    const context = `${TrackingService.name}.${this.createTracking.name}`;
    const checkDefinedAndQuantityOrderItemResult = await this.validateDefinedAndQuantityOrderItem(
      requestData.trackingOrderItems
    );
    if(!checkDefinedAndQuantityOrderItemResult.isValid) {
      this.logger.warn('Invalid order item data', context);
      throw new BadRequestException('Invalid order item data');
    }
    const orderResult = await this.validateOrderItemInOneOrder(requestData.trackingOrderItems);
    if(!orderResult) {
      this.logger.warn('All request order items must belong to one order', context);
      throw new BadRequestException('All request order items must belong to one order');
    }

    let savedTrackingId: string = '';
    const orderItemsData = checkDefinedAndQuantityOrderItemResult.orderItemsData;
    if(requestData.type === TrackingType.BY_ROBOT) {
      if(orderResult.type === OrderType.TAKE_OUT) {
        this.logger.warn(`This order ${orderResult.slug} for take out, can not use robot`, context);
        throw new BadRequestException('This order for take out, can not use robot');
      }

      const tableLocation: string = await this.getLocationTableByOrder(orderResult);
      if(!tableLocation) {
        this.logger.warn(`Can not find table location in order ${orderResult.slug} , please check table information`, context);
        throw new BadRequestException('Can not find table location, please check table information');
      }
      const workflow = await this.workflowRepository.findOne({
        where: {
          branch: {
            orders: {
              slug: orderResult.slug
            }
          }
        }
      });
      if(!workflow) {
        this.logger.warn(`Must add work flow for this branch ${orderResult.branch.slug}`, context);
        throw new BadRequestException('Must add work flow for this branch');
      }
      const requestData: RunWorkFlowRequestDto = {
        order_code: orderResult.slug,
        location: tableLocation
      }
      const workFlow: WorkFlowExecutionResponseDto = 
        await this.robotConnectorClient.runWorkFlow(workflow.workflowId, requestData);

      const tracking = new Tracking();
      Object.assign(tracking, {
        workFlowInstance: workFlow.workflow_execution_id
      });

      savedTrackingId = await this.createTrackingAndTrackingOrderItem(
        tracking,
        orderItemsData
      );
    }

    if(requestData.type === TrackingType.BY_STAFF) {
      const tracking = new Tracking();
      Object.assign(tracking, { status: WorkFlowStatus.COMPLETED });
      
      savedTrackingId = await this.createTrackingAndTrackingOrderItem(
        tracking,
        orderItemsData
      );
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

  /**
   * Validate the order item about the definition and request quantity
   * @param {CreateTrackingOrderItemRequestDto[]} orderItems The array of data to create many order item
   * @returns {Promise<ValidateDefinedAndQuantityOrderItem>} The result of validation
   */
  async validateDefinedAndQuantityOrderItem (
    orderItems: CreateTrackingOrderItemRequestDto[]
  ): Promise<ValidateDefinedAndQuantityOrderItem> {
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

  /**
   * Validate order items belong to a order or not
   * @param {CreateTrackingOrderItemRequestDto} orderItems The array of order item slug 
   * @returns {Promise<Order | null>} The order of order item array
   */
  async validateOrderItemInOneOrder (
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

  /**
   * Get location of table
   * @param {Order} order The data of order have branch data
   * @returns {Promise<string | null>} The location of table
   */
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

  /**
   * Create tracking and tracking order item simultaneously with rollback
   * @param {Tracking} tracking The new instance of Tracking 
   * @param {CreateTrackingOrderItemWithQuantityAndOrderItemEntity} orderItemsData The array of order item data with each request quantity
   * @returns {Promise<string>} The id of create tracking
   */
  async createTrackingAndTrackingOrderItem(
    tracking: Tracking,
    orderItemsData: CreateTrackingOrderItemWithQuantityAndOrderItemEntity[]
  ): Promise<string> {
    const context = `${TrackingService.name}.${this.createTrackingAndTrackingOrderItem.name}`;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdTracking = await queryRunner.manager.save(tracking);

      // create tracking order item
      for(let i = 0; i < orderItemsData.length; i++) {
        let trackingOrderItem = new TrackingOrderItem();
        Object.assign(trackingOrderItem, {
          quantity: orderItemsData[i].quantity,
          orderItem: orderItemsData[i].orderItem,
          tracking: createdTracking
        });

        await queryRunner.manager.save(trackingOrderItem);
      }
      await queryRunner.commitTransaction();
      return createdTracking.id;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.warn(
        `Create tracking and tracking order item failed`,
        context,
      );
      throw new BadRequestException('Create tracking adn tracking order item failed')
    } finally {
      await queryRunner.release();
    }
  }

  async changeStatus (
    slug: string,
    status: string
  ): Promise<TrackingResponseDto> {
    const tracking = await this.trackingRepository.findOne({
      where: {
        slug
      },
      relations: ['trackingOrderItems.orderItem']
    });

    if(!tracking) throw new BadRequestException("Tracking not found");

    Object.assign(tracking, { status });
    const updatedTracking = await this.trackingRepository.save(tracking);
    const trackingDto = this.mapper.map(updatedTracking, Tracking, TrackingResponseDto);
    return trackingDto;
  }
}
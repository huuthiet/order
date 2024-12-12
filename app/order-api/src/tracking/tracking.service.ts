import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DataSource, In, Repository } from 'typeorm';
import { Tracking } from './tracking.entity';
import { CreateTrackingRequestDto, TrackingResponseDto } from './tracking.dto';
import {
  CreateTrackingOrderItemRequestDto,
  CreateTrackingOrderItemWithQuantityAndOrderItemEntity,
} from 'src/tracking-order-item/tracking-order-item.dto';
import { Order } from 'src/order/order.entity';
import { OrderItem } from 'src/order-item/order-item.entity';
import { TrackingType, WorkflowStatus } from './tracking.constants';
import { TrackingOrderItem } from 'src/tracking-order-item/tracking-order-item.entity';
import { Table } from 'src/table/table.entity';
import { OrderType } from 'src/order/order.contants';
import { RobotConnectorClient } from 'src/robot-connector/robot-connector.client';
import {
  QRLocationResponseDto,
  RobotResponseDto,
  RunWorkflowRequestDto,
  WorkflowExecutionResponseDto,
} from 'src/robot-connector/robot-connector.dto';
import { Workflow } from 'src/workflow/workflow.entity';
import { ConfigService } from '@nestjs/config';
import { RobotStatus } from 'src/robot-connector/robot-connector.constants';
import * as _ from 'lodash';
import { TrackingScheduler } from './tracking.scheduler';
import { TrackingException } from './tracking.exception';
import { TrackingValidation } from './tracking.validation';
import { OrderItemException } from 'src/order-item/order-item.exception';
import { OrderItemValidation } from 'src/order-item/order-item.validation';
import { TableException } from 'src/table/table.exception';
import { TableValidation } from 'src/table/table.validation';
import { WorkflowException } from 'src/workflow/workflow.exception';
import { WorkflowValidation } from 'src/workflow/workflow.validation';
import { RobotConnectorException } from 'src/robot-connector/robot-connector.exception';
import { RobotConnectorValidation } from 'src/robot-connector/robot-connector.validation';
import { SystemConfigService } from 'src/system-config/system-config.service';

@Injectable()
export class TrackingService implements OnModuleInit {
  private robotId: string;

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
    private readonly trackingScheduler: TrackingScheduler,
    private readonly systemConfigService: SystemConfigService,
  ) {}

  async onModuleInit() {
    const context = `${TrackingService.name}.${this.onModuleInit.name}`;
    this.robotId = await this.systemConfigService.get('ROBOT_ID');
    this.logger.log(`Robot id loaded: ${this.robotId}`, context);
  }

  /**
   *
   * @param {CreateTrackingRequestDto} requestData The data to create a new tracking
   * @returns {Promise<TrackingResponseDto>} The created tracking data
   */
  async createTracking(
    requestData: CreateTrackingRequestDto,
  ): Promise<TrackingResponseDto> {
    const context = `${TrackingService.name}.${this.createTracking.name}`;

    await this.checkCurrentShipment();

    const orderItemsData = await this.validateDefinedAndQuantityOrderItem(
      requestData.trackingOrderItems,
    );
    // await this.validateOrderItemInOneOrder(requestData.trackingOrderItems);
    // validate order item of orders in a table
    await this.validateOrderItemInOneTable(requestData.trackingOrderItems);

    // send one order code
    const orderItem = await this.orderItemRepository.findOne({
      where: {
        slug: requestData.trackingOrderItems[0].orderItem,
      },
      relations: ['order.branch', 'order.orderItems'],
    });
    const order = orderItem.order;

    let savedTrackingId: string = '';
    if (requestData.type === TrackingType.BY_ROBOT) {
      if (order.type === OrderType.TAKE_OUT) {
        this.logger.warn(
          `${TrackingValidation.ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT} ${order.slug}`,
          context,
        );
        throw new TrackingException(
          TrackingValidation.ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT,
        );
      }

      const tableLocation: string = await this.getLocationTableByOrder(order);

      const workflowId: string = await this.getWorkflowIdByOrder(order);

      await this.checkRobotStatusBeforeCall();

      const requestData: RunWorkflowRequestDto = {
        runtime_config: {
          raybot_id: this.robotId,
          location: tableLocation,
          order_code: order.slug,
        },
      };
      const workflowRobot: WorkflowExecutionResponseDto =
        await this.robotConnectorClient.runWorkflow(workflowId, requestData);

      const tracking = new Tracking();
      Object.assign(tracking, {
        workflowExecution: workflowRobot.workflow_execution_id,
      });

      savedTrackingId = await this.createTrackingAndTrackingOrderItem(
        tracking,
        orderItemsData,
      );
      this.trackingScheduler.startUpdateStatusTracking();
    }

    if (requestData.type === TrackingType.BY_STAFF) {
      const tracking = new Tracking();
      Object.assign(tracking, { status: WorkflowStatus.COMPLETED });

      savedTrackingId = await this.createTrackingAndTrackingOrderItem(
        tracking,
        orderItemsData,
      );
      await this.trackingScheduler.updateStatusOrder(savedTrackingId);
    }

    const trackingData = await this.trackingRepository.findOne({
      where: {
        id: savedTrackingId,
      },
      relations: ['trackingOrderItems.orderItem'],
    });

    const TrackingDto = this.mapper.map(
      trackingData,
      Tracking,
      TrackingResponseDto,
    );
    return TrackingDto;
  }

  /**
   * Check current shipment
   * @throws {TrackingException} If there are shipments running or pending
   */
  async checkCurrentShipment(): Promise<void> {
    const context = `${TrackingService.name}.${this.checkCurrentShipment.name}`;
    const trackings = await this.trackingRepository.find({
      where: {
        status: In([WorkflowStatus.PENDING, WorkflowStatus.RUNNING]),
      },
    });
    if (!_.isEmpty(trackings)) {
      this.logger.warn(
        TrackingValidation.WAIT_FOR_CURRENT_SHIPMENT_COMPLETED,
        context,
      );
      throw new TrackingException(
        TrackingValidation.WAIT_FOR_CURRENT_SHIPMENT_COMPLETED,
      );
    }
  }

  /**
   * Validate the order item about the definition and request quantity
   * @param {CreateTrackingOrderItemRequestDto[]} orderItems The array of data to create many order item
   * @returns {Promise<CreateTrackingOrderItemWithQuantityAndOrderItemEntity[]>} The result of validation
   * @throws {OrderItemException} If order item not found
   * @throws {OrderItemException} If order item not belong to any order
   * @throws {OrderItemException} If request order item greater order item quantity
   */
  async validateDefinedAndQuantityOrderItem(
    orderItems: CreateTrackingOrderItemRequestDto[],
  ): Promise<CreateTrackingOrderItemWithQuantityAndOrderItemEntity[]> {
    const context = `${TrackingService.name}.${this.validateDefinedAndQuantityOrderItem.name}`;
    const orderItemsData: CreateTrackingOrderItemWithQuantityAndOrderItemEntity[] =
      [];
    for (let i = 0; i < orderItems.length; i++) {
      // check defined
      const orderItem = await this.orderItemRepository.findOne({
        where: {
          slug: orderItems[i].orderItem,
        },
        relations: ['order', 'trackingOrderItems.tracking'],
      });
      if (!orderItem) {
        this.logger.warn(OrderItemValidation.ORDER_ITEM_NOT_FOUND, context);
        throw new OrderItemException(OrderItemValidation.ORDER_ITEM_NOT_FOUND);
      }
      if (!orderItem.order) {
        this.logger.warn(
          OrderItemValidation.ORDER_ITEM_NOT_BELONG_TO_ANY_ORDER,
          context,
        );
        throw new OrderItemException(
          OrderItemValidation.ORDER_ITEM_NOT_BELONG_TO_ANY_ORDER,
        );
      }
      orderItemsData.push({
        quantity: orderItems[i].quantity,
        orderItem,
      });

      // check quantity

      // order item have not tracking order item
      if (_.isEmpty(orderItem.trackingOrderItems)) {
        if (orderItems[i].quantity > orderItem.quantity) {
          this.logger.warn(
            OrderItemValidation.REQUEST_ORDER_ITEM_GREATER_ORDER_ITEM_QUANTITY,
            context,
          );
          throw new OrderItemException(
            OrderItemValidation.REQUEST_ORDER_ITEM_GREATER_ORDER_ITEM_QUANTITY,
          );
        } else continue;
      }

      // order item have tracking order item
      const totalCompleted = orderItem.trackingOrderItems.reduce(
        (total, item) => {
          return item.tracking.status === WorkflowStatus.COMPLETED
            ? total + item.quantity
            : total;
        },
        0,
      );
      if (totalCompleted + orderItems[i].quantity > orderItem.quantity) {
        this.logger.warn(
          OrderItemValidation.REQUEST_ORDER_ITEM_GREATER_ORDER_ITEM_QUANTITY,
          context,
        );
        throw new OrderItemException(
          OrderItemValidation.REQUEST_ORDER_ITEM_GREATER_ORDER_ITEM_QUANTITY,
        );
      }
    }

    return orderItemsData;
  }

  /**
   * Validate order items belong to a order or not
   * @param {CreateTrackingOrderItemRequestDto} orderItems The array of order item slug
   * @throws {OrderItemException} If all order item not belong to a order
   */
  async validateOrderItemInOneOrder(
    orderItems: CreateTrackingOrderItemRequestDto[],
  ): Promise<void> {
    const context = `${TrackingService.name}.${this.validateOrderItemInOneOrder.name}`;
    const orderItemSlugs = orderItems.map((item) => item.orderItem);
    const orders = await this.orderRepository.find({
      where: {
        orderItems: {
          slug: In(orderItemSlugs),
        },
      },
      relations: ['branch', 'orderItems'],
    });
    if (orders.length !== 1) {
      this.logger.warn(
        OrderItemValidation.ALL_ORDER_ITEM_MUST_BELONG_TO_A_ORDER,
        context,
      );
      throw new OrderItemException(
        OrderItemValidation.ALL_ORDER_ITEM_MUST_BELONG_TO_A_ORDER,
      );
    }

    if (!orders[0].branch) {
      this.logger.warn(
        OrderItemValidation.ALL_ORDER_ITEM_MUST_BELONG_TO_A_ORDER,
        context,
      );
      throw new OrderItemException(
        OrderItemValidation.ALL_ORDER_ITEM_MUST_BELONG_TO_A_ORDER,
      );
    }
  }

  async validateOrderItemInOneTable(
    orderItems: CreateTrackingOrderItemRequestDto[],
  ): Promise<void> {
    const context = `${TrackingService.name}.${this.validateOrderItemInOneTable.name}`;
    const orderItemSlugs = orderItems.map((item) => item.orderItem);
    const orders = await this.orderRepository.find({
      where: {
        orderItems: {
          slug: In(orderItemSlugs),
        },
      },
      relations: ['branch'],
    });

    if (orders.length === 0) {
      new TrackingException(TrackingValidation.ORDERS_MUST_BELONG_TO_ONE_TABLE);
      this.logger.warn(
        TrackingValidation.ORDERS_MUST_BELONG_TO_ONE_TABLE.message,
        context,
      );
    }

    const firstOrder = orders[0];
    const checkOneTable = orders.every(
      (order) =>
        order.branch?.id === firstOrder.branch?.id &&
        order.tableName === firstOrder.tableName,
    );
    if (!checkOneTable) {
      new TrackingException(TrackingValidation.ORDERS_MUST_BELONG_TO_ONE_TABLE);
      this.logger.warn(
        TrackingValidation.ORDERS_MUST_BELONG_TO_ONE_TABLE.message,
        context,
      );
    }
  }

  /**
   * Get location of table
   * @param {Order} order The data of order have branch data
   * @returns {Promise<string>} The location of table
   * @throws {TableException} If table not found
   * @throws {TableException} If table does not have location
   */
  async getLocationTableByOrder(order: Order): Promise<string> {
    const context = `${TrackingService.name}.${this.getLocationTableByOrder.name}`;
    const table = await this.tableRepository.findOne({
      where: {
        name: order.tableName,
        branch: {
          id: order.branch.id,
        },
      },
    });
    if (!table) {
      this.logger.warn(TableValidation.TABLE_NOT_FOUND, context);
      throw new TableException(TableValidation.TABLE_NOT_FOUND);
    }
    if (!table.location) {
      this.logger.warn(TableValidation.TABLE_DO_NOT_HAVE_LOCATION, context);
      throw new TableException(TableValidation.TABLE_DO_NOT_HAVE_LOCATION);
    }
    const locationData: QRLocationResponseDto =
      await this.robotConnectorClient.getQRLocationById(table.location);

    return locationData.qr_code;
  }

  /**
   *
   * @param {Order} order The order data relate to branch
   * @returns {Promise<string>} The workflow id from ROBOT API
   * @throws {WorkflowException} If branch does not have workflow
   */
  async getWorkflowIdByOrder(order: Order): Promise<string> {
    const context = `${TrackingService.name}.${this.getWorkflowIdByOrder.name}`;
    const workflowData = await this.workflowRepository.findOne({
      where: {
        branch: {
          orders: {
            slug: order.slug,
          },
        },
      },
    });
    if (!workflowData) {
      this.logger.warn(
        `${WorkflowValidation.MUST_ADD_WORKFLOW_FOR_BRANCH} ${order.branch.slug}`,
        context,
      );
      throw new WorkflowException(
        WorkflowValidation.MUST_ADD_WORKFLOW_FOR_BRANCH,
      );
    }
    return workflowData.workflowId;
  }

  /**
   * @throws {RobotConnectorException} If robot is busy
   */
  async checkRobotStatusBeforeCall(): Promise<void> {
    const context = `${TrackingService.name}.${this.checkRobotStatusBeforeCall.name}`;
    const robotData: RobotResponseDto =
      await this.robotConnectorClient.getRobotById(this.robotId);

    if (robotData.status !== RobotStatus.IDLE) {
      this.logger.warn(
        `${RobotConnectorValidation.ROBOT_BUSY.message} ${this.robotId}`,
        context,
      );
      throw new RobotConnectorException(RobotConnectorValidation.ROBOT_BUSY);
    }
  }

  /**
   * Create tracking and tracking order item simultaneously with rollback
   * @param {Tracking} tracking The new instance of Tracking
   * @param {CreateTrackingOrderItemWithQuantityAndOrderItemEntity} orderItemsData The array of order item data with each request quantity
   * @returns {Promise<string>} The id of create tracking
   * @throws {TrackingException} If create tracking failed
   */
  async createTrackingAndTrackingOrderItem(
    tracking: Tracking,
    orderItemsData: CreateTrackingOrderItemWithQuantityAndOrderItemEntity[],
  ): Promise<string> {
    const context = `${TrackingService.name}.${this.createTrackingAndTrackingOrderItem.name}`;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdTracking = await queryRunner.manager.save(tracking);

      // create tracking order item
      // const trackingOrderItems: TrackingOrderItem[] = [];
      // for(let i = 0; i < orderItemsData.length; i++) {
      //   let trackingOrderItem = new TrackingOrderItem();
      //   Object.assign(trackingOrderItem, {
      //     quantity: orderItemsData[i].quantity,
      //     orderItem: orderItemsData[i].orderItem,
      //     tracking: createdTracking
      //   });

      //   trackingOrderItems.push(trackingOrderItem);
      // }
      const trackingOrderItems = orderItemsData.map((item) => {
        const trackingOrderItem = new TrackingOrderItem();
        Object.assign(trackingOrderItem, {
          quantity: item.quantity,
          orderItem: item.orderItem,
          tracking: createdTracking,
        });
        return trackingOrderItem;
      });
      await queryRunner.manager.save(trackingOrderItems);
      await queryRunner.commitTransaction();
      return createdTracking.id;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.warn(TrackingValidation.CREATE_TRACKING_FAILED, context);
      throw new TrackingException(TrackingValidation.CREATE_TRACKING_FAILED);
    } finally {
      await queryRunner.release();
    }
  }

  async changeStatus(
    slug: string,
    status: string,
  ): Promise<TrackingResponseDto> {
    const tracking = await this.trackingRepository.findOne({
      where: {
        slug,
      },
      relations: ['trackingOrderItems.orderItem'],
    });

    if (!tracking) throw new BadRequestException('Tracking not found');

    Object.assign(tracking, { status });
    const updatedTracking = await this.trackingRepository.save(tracking);
    const trackingDto = this.mapper.map(
      updatedTracking,
      Tracking,
      TrackingResponseDto,
    );
    return trackingDto;
  }

  async delete(slug: string): Promise<number> {
    const context = `${TrackingService.name}.${this.delete.name}`;
    const tracking = await this.trackingRepository.findOne({
      where: { slug },
      relations: ['trackingOrderItems'],
    });
    if (!tracking) {
      this.logger.warn(`Tracking ${slug} is not found`, context);
      throw new BadRequestException('Tracking is not found');
    }
    const trackingOrderItems = tracking.trackingOrderItems;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // create tracking order item
      for (let i = 0; i < trackingOrderItems.length; i++) {
        await queryRunner.manager.softDelete(TrackingOrderItem, {
          slug: trackingOrderItems[i].slug,
        });
      }
      const deleted = await queryRunner.manager.softDelete(Tracking, { slug });

      await queryRunner.commitTransaction();

      return deleted.affected || 0;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.warn(
        `Create tracking and tracking order item failed`,
        context,
      );
      throw new BadRequestException(
        'Create tracking adn tracking order item failed',
      );
    } finally {
      await queryRunner.release();
    }
  }
}

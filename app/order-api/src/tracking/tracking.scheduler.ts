import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as moment from 'moment';
import { NameCronTracking, WorkflowStatus } from './tracking.constants';
import { Tracking } from './tracking.entity';
import { RobotConnectorClient } from 'src/robot-connector/robot-connector.client';
import * as _ from 'lodash';
import { OrderStatus } from 'src/order/order.contants';
import { Order } from 'src/order/order.entity';

@Injectable()
export class TrackingScheduler {
  constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly robotConnectorClient: RobotConnectorClient,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: NestLogger,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  /**
   * Update status of tracking every 30 seconds 
   */
  @Cron(CronExpression.EVERY_5_SECONDS, { name: NameCronTracking.UPDATE_STATUS_TRACKING })
  async UpdateStatusTracking() {
    const context = `${TrackingScheduler.name}.${this.UpdateStatusTracking.name}`;
    const trackings = await this.trackingRepository.find({
      where: {
        status: In([WorkflowStatus.PENDING, WorkflowStatus.RUNNING]),
      }
    });
    if(_.isEmpty(trackings)) this.stopUpdateStatusTracking();

    // update for tracking
    const workflowExecutionIds = trackings.map((item) => item.workflowExecution);
    await Promise.all(
      workflowExecutionIds.map(async (id) => {
        try {
          const workflow = await this.robotConnectorClient.retrieveWorkflowExecution(id);
          
          const tracking = await this.trackingRepository.findOne({
            where: { workflowExecution: id },
          });
    
          Object.assign(tracking, { status: workflow.status });
          await this.trackingRepository.save(tracking);
          console.log("updated tracking")
        } catch (error) {
          this.logger.warn(`Error processing workflow execution ${id}`, context);
        }
      })
    );
    

    // update order status
    const trackingIds = trackings.map((item) => item.id);
    await Promise.all(
      trackingIds.map(async (id) => {
        try {
          await this.updateStatusOrder(id);
        } catch (error) {
          this.logger.warn(`Error updating status for order`, context);
        }
      })
    );
    
  }

  /**
   * Update latest order status by tracking id
   * @param {string} trackingId The id of tracking
   */
  async updateStatusOrder(
    trackingId: string
  ) {
    const context = `${TrackingScheduler.name}.${this.updateStatusOrder.name}`;

    const order = await this.orderRepository.findOne({
      where: {
        orderItems: {
          trackingOrderItems: {
            tracking: {
              id: trackingId
            }
          }
        }
      },
      relations: [
        'payment',
        'owner',
        'orderItems.variant.size',
        'orderItems.variant.product',
        'orderItems.trackingOrderItems.tracking',
      ],
    });
    // check by total quantity each order item
    const totalBase = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalQuantities = order.orderItems.reduce(
      (totals, item) => {
        const itemQuantities = item.trackingOrderItems.reduce(
          (statusSums, trackingItem) => {
            const status = trackingItem.tracking.status;
            if (
              status === WorkflowStatus.COMPLETED ||
              status === WorkflowStatus.RUNNING
            ) {
              statusSums[status] =
                (statusSums[status] || 0) + trackingItem.quantity;
            }
            return statusSums;
          },
          {} as Record<WorkflowStatus, number>,
        );
    
        Object.keys(itemQuantities).forEach((status) => {
          totals[status as WorkflowStatus] =
            (totals[status as WorkflowStatus] || 0) +
            itemQuantities[status as WorkflowStatus];
        });

        return totals;
      },
      {} as Record<WorkflowStatus, number>,
    );

    let defaultStatus: string = order.status;

    if (totalBase > totalQuantities[WorkflowStatus.COMPLETED]) {
      if (totalQuantities[WorkflowStatus.RUNNING] > 0) {
        Object.assign(order, { status: OrderStatus.SHIPPING });
        const updatedOrder = await this.orderRepository.save(order);
        defaultStatus = updatedOrder.status;
      }
    } else if (totalBase === totalQuantities[WorkflowStatus.COMPLETED]) {
      Object.assign(order, { status: OrderStatus.COMPLETED });
      const updatedOrder = await this.orderRepository.save(order);
      defaultStatus = updatedOrder.status;
    }
    this.logger.log(`Order status ${order.slug} has been updated`, context);

  }

  /**
   * Stop a specific cron function
   * @param {string} name The name of cron function
   */
  private stopUpdateStatusTracking() {
    const context = `${TrackingScheduler.name}.${this.stopUpdateStatusTracking.name}`;
    const job = this.schedulerRegistry.getCronJob(NameCronTracking.UPDATE_STATUS_TRACKING);
    job.stop();
    this.logger.log(`Cron job "${NameCronTracking.UPDATE_STATUS_TRACKING}" has been stopped.`, context);
  }

  /**
   * Restart a specific cron function
   * @param {string} name The name of cron function
   * @param {string} trackingId The id of tracking
   */
  startUpdateStatusTracking() {
    const context = `${TrackingScheduler.name}.${this.startUpdateStatusTracking.name}`;
    const job = this.schedulerRegistry.getCronJob(NameCronTracking.UPDATE_STATUS_TRACKING);
    job.start();
    this.logger.log(`Cron job "${NameCronTracking.UPDATE_STATUS_TRACKING}" has been restarted.`, context);
  }
}

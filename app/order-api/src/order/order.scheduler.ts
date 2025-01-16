import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { Table } from 'src/table/table.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { OrderStatus } from './order.contants';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TransactionManagerService } from 'src/db/transaction-manager.service';

@Injectable()
export class OrderScheduler {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly transactionManagerService: TransactionManagerService,
  ) {}

  // Called once after 5 minutes
  async cancelOrder(orderSlug: string) {
    const context = `${OrderScheduler.name}.${this.cancelOrder.name}`;
    this.logger.log(`Cancel order ${orderSlug}`, context);

    const order = await this.orderRepository.findOne({
      where: { slug: orderSlug },
      relations: ['orderItems.variant', 'branch'],
    });
    if (!order) {
      this.logger.warn(`Order ${orderSlug} not found`, context);
      return;
    }

    if (order.status !== OrderStatus.PENDING) {
      this.logger.warn(`Order ${orderSlug} is not pending`, context);
      return;
    }

    this.transactionManagerService.execute<void>(
      async (manager) => {
        await manager.remove(order.orderItems);
        await manager.remove(order);
      },
      () => {
        this.logger.log(`Order ${orderSlug} has been canceled`, context);
      },
      (error) => {
        this.logger.error(
          `Error when cancel order ${orderSlug}: ${error.message}`,
          error.stack,
          context,
        );
      },
    );
  }

  addCancelOrderJob(orderSlug: string) {
    const context = `${OrderScheduler.name}.${this.addCancelOrderJob.name}`;
    const jobName = `CANCEL_ORDER_${orderSlug}`;
    this.logger.log(`Add cancel order job ${orderSlug}`, context);

    try {
      const existedJob = this.schedulerRegistry.getTimeout(jobName);
      if (existedJob) {
        this.logger.warn(`Job ${orderSlug} already exists`, context);
        return;
      }
    } catch (error) {
      this.logger.error(`Error when get job ${orderSlug}`, context);
    }

    const job = setTimeout(
      async () => {
        await this.cancelOrder(orderSlug);
      },
      5 * 60 * 1000,
    ); // 5 minutes

    this.schedulerRegistry.addTimeout(jobName, job);
  }
}

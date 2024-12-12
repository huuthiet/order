import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DataSource, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Table } from 'src/table/table.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class OrderScheduler {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly dataSource: DataSource,
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  async migrateTableNameToTable() {
    const context = `${OrderScheduler.name}.${this.migrateTableNameToTable.name}`;
    this.logger.log(`Migrating tablename to table...`, context);

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.branch', 'branch')
      .where('table.id IS NULL')
      .getMany();

    this.logger.log(`Found ${orders.length} orders without table`, context);

    const updatedOrders = await Promise.all(
      orders.map(async (item) => {
        const table = await this.tableRepository.findOne({
          where: {
            branch: {
              id: item.branch?.id,
            },
          },
        });
        if (table) {
          item.table = table;
        }
        return item;
      }),
    );

    // Updated
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(updatedOrders);
      await queryRunner.commitTransaction();
      this.logger.log(
        `The table in the list of orders has been updated successfully.`,
        context,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error encountered while migrating: ${error.message}`,
        context,
      );
    } finally {
      await queryRunner.release();
    }
  }
}

import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Revenue } from './revenue.entity';
import { DataSource, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getCurrentRevenueClause } from './revenue.clause';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RevenueQueryResponseDto } from './revenue.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class RevenueScheduler {
  constructor(
    @InjectRepository(Revenue)
    private readonly revenueRepository: Repository<Revenue>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private readonly dataSource: DataSource,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async refreshRevenue() {
    const context = `${RevenueScheduler.name}.${this.refreshRevenue.name}`;
    const results: RevenueQueryResponseDto[] =
      await this.revenueRepository.query(getCurrentRevenueClause);

    const revenues = results.map((item) => {
      return this.mapper.map(item, RevenueQueryResponseDto, Revenue);
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(revenues);
      await queryRunner.commitTransaction();
      this.logger.log(
        `Revenue ${new Date().toISOString()} created successfully`,
        context,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error when creating revenues: ${JSON.stringify(error)}`,
        error.stack,
        context,
      );
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}

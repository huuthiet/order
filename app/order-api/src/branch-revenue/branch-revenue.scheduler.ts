import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchRevenue } from './branch-revenue.entity';
import { DataSource, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getCurrentBranchRevenueClause } from './branch-revenue.clause';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BranchRevenueQueryResponseDto } from './branch-revenue.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class BranchRevenueScheduler {
  constructor(
    @InjectRepository(BranchRevenue)
    private readonly branchRevenueRepository: Repository<BranchRevenue>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    private readonly dataSource: DataSource,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async refreshBranchRevenue() {
    const context = `${BranchRevenue.name}.${this.refreshBranchRevenue.name}`;
    const results: BranchRevenueQueryResponseDto[] =
      await this.branchRevenueRepository.query(getCurrentBranchRevenueClause);

    const revenues = results.map((item) => {
      return this.mapper.map(
        item,
        BranchRevenueQueryResponseDto,
        BranchRevenue,
      );
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

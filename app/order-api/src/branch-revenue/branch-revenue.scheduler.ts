import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchRevenue } from './branch-revenue.entity';
import { DataSource, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getCurrentBranchRevenueClause } from './branch-revenue.clause';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BranchRevenueQueryResponseDto } from './branch-revenue.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { plainToInstance } from 'class-transformer';
import { BranchRevenueException } from './branch-revenue.exception';
import { BranchRevenueValidation } from './branch-revenue.validation';

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
    const results: any[] = await this.branchRevenueRepository.query(
      getCurrentBranchRevenueClause,
    );

    const branchRevenueQueryResponseDtos = plainToInstance(
      BranchRevenueQueryResponseDto,
      results,
    );

    const revenues = branchRevenueQueryResponseDtos.map((item) => {
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
        `Error when creating branch revenues: ${JSON.stringify(error)}`,
        error.stack,
        context,
      );
      throw new BranchRevenueException(
        BranchRevenueValidation.CREATE_BRANCH_REVENUE_ERROR,
        error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }
}

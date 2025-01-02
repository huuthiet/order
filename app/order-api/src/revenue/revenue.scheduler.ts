import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Revenue } from './revenue.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getAllRevenueClause, getCurrentRevenueClause } from './revenue.clause';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { RevenueQueryResponseDto } from './revenue.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { RevenueException } from './revenue.exception';
import { RevenueValidation } from './revenue.validation';
import * as _ from 'lodash';
import { TransactionManagerService } from 'src/db/transaction-manager.service';
import moment from 'moment';

@Injectable()
export class RevenueScheduler {
  constructor(
    @InjectRepository(Revenue)
    private readonly revenueRepository: Repository<Revenue>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly transactionManagerService: TransactionManagerService,
  ) {}

  @Timeout(5000)
  async initRevenue() {
    const context = `${RevenueScheduler.name}.${this.initRevenue.name}`;
    const hasRevenue = await this.revenueRepository.find();
    if (!_.isEmpty(hasRevenue)) {
      this.logger.error(`Revenue already exists`, null, context);
      return;
    }

    const results: RevenueQueryResponseDto[] =
      await this.revenueRepository.query(getAllRevenueClause);

    const revenues = results.map((item) => {
      return this.mapper.map(item, RevenueQueryResponseDto, Revenue);
    });

    this.transactionManagerService.execute(
      async (manager) => {
        await manager.save(revenues);
      },
      () =>
        this.logger.log(
          `${revenues.length} revenues initialized successfully`,
          context,
        ),
      (error) => {
        this.logger.error(
          `An error occurred while initializing revenues: ${JSON.stringify(error)}`,
          error.stack,
          context,
        );
        throw new RevenueException(
          RevenueValidation.CREATE_REVENUE_ERROR,
          error.message,
        );
      },
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async refreshRevenue() {
    const context = `${RevenueScheduler.name}.${this.refreshRevenue.name}`;

    const currentDate = new Date(moment().format('YYYY-MM-DD'));
    const hasRevenue = this.revenueRepository.find({
      where: {
        date: currentDate,
      },
    });
    if (hasRevenue) {
      this.logger.log(`Revenue for ${currentDate} already exists`, context);
      return;
    }

    const results: RevenueQueryResponseDto[] =
      await this.revenueRepository.query(getCurrentRevenueClause);
    const revenues = results.map((item) => {
      return this.mapper.map(item, RevenueQueryResponseDto, Revenue);
    });

    this.transactionManagerService.execute(
      async (manager) => {
        await manager.save(revenues);
      },
      () =>
        this.logger.log(
          `${revenues.length} revenues created successfully`,
          context,
        ),
      (error) => {
        this.logger.error(
          `Error when creating revenues: ${JSON.stringify(error)}`,
          error.stack,
          context,
        );
        throw new RevenueException(
          RevenueValidation.CREATE_REVENUE_ERROR,
          error.message,
        );
      },
    );
  }
}

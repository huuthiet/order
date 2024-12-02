import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from './logger.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as moment from 'moment';

@Injectable()
export class LoggerScheduler {
  constructor(
    @InjectRepository(Logger)
    private readonly loggerRepository: Repository<Logger>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: NestLogger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async handleDeleteLogs() {
    const context = `${LoggerScheduler.name}.${this.handleDeleteLogs.name}`;
    const dateOfLastWeek = moment().subtract(1, 'weeks').toDate();
    this.logger.log(`Deleting logs at ${dateOfLastWeek}`, context);

    const deleteResult = await this.loggerRepository.delete({
      createdAt: dateOfLastWeek,
    });

    this.logger.log(`Deleted ${deleteResult.affected || 0} logs`, context);

    // Return the number of deleted records
    return deleteResult.affected || 0;
  }
}

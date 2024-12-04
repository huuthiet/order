import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DbService } from './db.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class DbScheduler {
  constructor(
    private readonly dbService: DbService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    const context = `${DbScheduler.name}.${this.handleCron.name}`;
    this.logger.log(`Start backup database`, context);
    await this.dbService.backup();
  }
}

import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DbService } from './db.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { catchError, from, retry, tap } from 'rxjs';

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
    from(this.dbService.backup())
      .pipe(
        tap(() => this.logger.log(`Attempting database backup`, context)),
        retry(5), // Retry up to 5 times
        catchError((error) => {
          this.logger.error(
            `Database backup failed after multiple attempts`,
            error.stack,
            context,
          );
          return Promise.reject(
            new BadRequestException(
              `Error when backing up data: ${error.message}`,
            ),
          );
        }),
      )
      .subscribe({
        next: () =>
          this.logger.log(`Database backup completed successfully`, context),
        error: (err) =>
          this.logger.error(
            `Final failure after retries: ${err.message}`,
            err.stack,
            context,
          ),
      });
  }
}

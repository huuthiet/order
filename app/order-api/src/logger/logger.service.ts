import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from './logger.entity';
import { And, LessThan, MoreThan, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { GetLoggerRequestDto, LoggerResponseDto } from './logger.dto';
import { AppPaginatedResponseDto } from 'src/app/app.dto';
import * as moment from 'moment';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Logger)
    private readonly loggerRepository: Repository<Logger>,
    @InjectMapper()
    private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: NestLogger,
  ) {}

  async getAllLogs(query: GetLoggerRequestDto) {
    const [logs, total] = await this.loggerRepository.findAndCount({
      where: { level: query.level },
      order: { createdAt: 'DESC' },
      skip: (query.page - 1) * query.size,
      take: query.size,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / query.size);
    // Determine hasNext and hasPrevious
    const hasNext = query.page < totalPages;
    const hasPrevious = query.page > 1;

    return {
      hasNext: hasNext,
      hasPrevios: hasPrevious,
      items: this.mapper.mapArray(logs, Logger, LoggerResponseDto),
      total,
      page: query.page,
      pageSize: query.size,
      totalPages,
    } as AppPaginatedResponseDto<LoggerResponseDto>;
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async handleDeleteLogs() {
    const context = `${LoggerService.name}.${this.handleDeleteLogs.name}`;
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

import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Revenue } from './revenue.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { GetRevenueQueryDto, RevenueResponseDto } from './revenue.dto';
import * as _ from 'lodash';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(Revenue)
    private readonly revenueRepository: Repository<Revenue>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(query: GetRevenueQueryDto) {
    const context = `${Revenue.name}.${this.findAll.name}`;
    const findOptionsWhere: FindOptionsWhere<Revenue> = {};

    // Query from start date to current date
    if (query.startDate && !query.endDate) {
      const currentDate = new Date();
      findOptionsWhere.date = Between(query.startDate, currentDate);
    }

    // Query from start date to end date
    if (query.startDate && query.endDate) {
      findOptionsWhere.date = Between(query.startDate, query.endDate);
    }

    // Throw exception if start date is not provided
    if (!query.startDate && query.endDate) {
      this.logger.error(`Start date is not provided`, null, context);
      throw new BadRequestException(`Start date must be provided`);
    }

    const revenues = await this.revenueRepository.find({
      where: findOptionsWhere,
    });

    return this.mapper.mapArray(revenues, Revenue, RevenueResponseDto);
  }
}

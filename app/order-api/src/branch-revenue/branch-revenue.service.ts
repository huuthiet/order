import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchRevenue } from './branch-revenue.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  BranchRevenueResponseDto,
  GetBranchRevenueQueryDto,
} from './branch-revenue.dto';
import { Branch } from 'src/branch/branch.entity';
import { BranchException } from 'src/branch/branch.exception';
import { BranchValidation } from 'src/branch/branch.validation';
import * as _ from 'lodash';

@Injectable()
export class BranchRevenueService {
  constructor(
    @InjectRepository(BranchRevenue)
    private readonly branchRevenueRepository: Repository<BranchRevenue>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(branchSlug: string, query: GetBranchRevenueQueryDto) {
    const context = `${BranchRevenue.name}.${this.findAll.name}`;
    const findOptionsWhere: FindOptionsWhere<BranchRevenue> = {};

    if (branchSlug) {
      const branch = await this.branchRepository.findOne({
        where: {
          slug: branchSlug,
        },
      });
      if (!branch) throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);
      findOptionsWhere.branchId = branch.id;
    }

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

    const revenues = await this.branchRevenueRepository.find({
      where: findOptionsWhere,
    });

    return this.mapper.mapArray(
      revenues,
      BranchRevenue,
      BranchRevenueResponseDto,
    );
  }
}

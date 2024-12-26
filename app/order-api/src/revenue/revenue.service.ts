import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Revenue } from './revenue.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { GetRevenueQueryDto, RevenueResponseDto } from './revenue.dto';
import { Branch } from 'src/branch/branch.entity';
import { BranchException } from 'src/branch/branch.exception';
import { BranchValidation } from 'src/branch/branch.validation';

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(Revenue)
    private readonly revenueRepository: Repository<Revenue>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(query: GetRevenueQueryDto) {
    const branch = await this.branchRepository.findOne({
      where: {
        slug: query.branch,
      },
    });
    if (!branch) throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);

    const revenues = await this.revenueRepository.find({
      where: {
        branchId: branch.id,
      },
    });

    return this.mapper.mapArray(revenues, Revenue, RevenueResponseDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} revenue`;
  }
}

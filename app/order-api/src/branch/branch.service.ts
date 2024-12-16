import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  BranchResponseDto,
  CreateBranchDto,
  UpdateBranchDto,
} from './branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { BranchException } from './branch.exception';
import { BranchValidation } from './branch.validation';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
    @InjectMapper() private mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async updateBranch(slug: string, requestData: UpdateBranchDto) {
    const context = `${BranchService.name}.${this.updateBranch.name}`;
    const branch = await this.branchRepository.findOne({
      where: {
        slug,
      },
    });
    if (!branch) throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);

    // Update branch
    Object.assign(branch, {
      ...requestData,
    });

    try {
      const updatedBranch = await this.branchRepository.save(branch);
      return this.mapper.map(updatedBranch, Branch, BranchResponseDto);
    } catch (error) {
      this.logger.error(
        `Error when updating branch: ${error.message}`,
        error.stack,
        context,
      );
    }
  }

  /**
   * Create new branch
   * @param {CreateBranchDto} requestData
   * @returns {Promise<BranchResponseDto>} New branch created successfully
   */
  async createBranch(requestData: CreateBranchDto): Promise<BranchResponseDto> {
    const branch = this.mapper.map(requestData, CreateBranchDto, Branch);

    this.branchRepository.create(branch);
    const createBranch = await this.branchRepository.save(branch);

    return this.mapper.map(createBranch, Branch, BranchResponseDto);
  }

  /**
   * Retrieve all branch
   * @returns {Promise<BranchResponseDto[]>} All branchs have been retrieved successfully
   */
  async getAllBranchs(): Promise<BranchResponseDto[]> {
    const branchs = await this.branchRepository.find();
    return this.mapper.mapArray(branchs, Branch, BranchResponseDto);
  }
}

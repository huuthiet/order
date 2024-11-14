import { Injectable } from '@nestjs/common';
import { BranchResponseDto, CreateBranchDto } from './branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private branchRepository: Repository<Branch>,
    @InjectMapper() private mapper: Mapper,
  ) {}

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

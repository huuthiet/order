import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Branch } from "./branch.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { BranchValidation } from "./branch.validation";
import { BranchException } from "./branch.exception";

@Injectable()
export class BranchUtils {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    
  ) {}

  async getBranch(where: FindOptionsWhere<Branch>): Promise<Branch> {
    const context = `${BranchUtils.name}.${this.getBranch.name}`;

    const branch = await this.branchRepository.findOne({
      where
    });
    if(!branch) {
      this.logger.warn(BranchValidation.BRANCH_NOT_FOUND.message, context);
      throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);
    }
    return branch;
  }
}
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Workflow } from "./workflow.entity";
import { Repository } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CreateWorkflowRequestDto, WorkflowResponseDto } from "./workflow.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Branch } from "src/branch/branch.entity";

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow) 
    private workflowRepository: Repository<Workflow>,
    @InjectRepository(Branch) 
    private branchRepository: Repository<Branch>,
    @InjectMapper() private mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async addNewWorkflow(
    requestData: CreateWorkflowRequestDto
  ): Promise<WorkflowResponseDto> {
    const context = `${WorkflowService.name}.${this.addNewWorkflow.name}`;
    const branch = await this.branchRepository.findOneBy({ slug: requestData.branch });
    if(!branch) {
      this.logger.warn(`Branch ${requestData.branch} is not found`, context);
      throw new BadRequestException('Branch is not found');
    }

    const workflowByBranch = await this.workflowRepository.findOne({
      where: {
        branch: {
          slug: requestData.branch
        }
      }
    });
    if(workflowByBranch) {
      this.logger.warn(`Branch ${requestData.branch} have a workflow, can not add`, context);
      throw new BadRequestException('Branch have a workflow, can not add');
    }

    const workflow = await this.workflowRepository.findOneBy({ workflowId: requestData.workflowId});
    if(workflow) {
      this.logger.warn(`Workflow ${requestData.workflowId} already exists`, context);
      throw new BadRequestException('Workflow already exists');
    }
    
    const workFlowData = this.mapper.map(requestData, CreateWorkflowRequestDto, Workflow);
    Object.assign(workFlowData, { branch });
    const newWorkflow = this.workflowRepository.create(workFlowData);
    const createdWorkflow = await this.workflowRepository.save(newWorkflow);
    const workflowDto = this.mapper.map(createdWorkflow, Workflow, WorkflowResponseDto);
    return workflowDto;
  }

  async getAllWorkFlowByBranch(
    branchSlug: string
  ): Promise<WorkflowResponseDto[]> {
    const context = `${WorkflowService.name}.${this.getAllWorkFlowByBranch.name}`;
    // const branch = this.branchRepository.findOneBy({ slug: branchSlug });
    // if(!branch) {
    //   this.logger.warn(`Branch ${branchSlug} is not found`, context);
    //   throw new BadRequestException('Branch is not found');
    // }
    const workflows = await this.workflowRepository.find({
      where: {
        branch: {
          slug: branchSlug
        }
      }
    });

    const workflowsDto = this.mapper.mapArray(workflows, Workflow, WorkflowResponseDto);
    return workflowsDto;
  }
}
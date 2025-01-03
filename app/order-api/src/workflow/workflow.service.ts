import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Workflow } from "./workflow.entity";
import { In, Repository } from "typeorm";
import * as _ from "lodash";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CreateWorkflowRequestDto, UpdateWorkflowRequestDto, WorkflowResponseDto } from "./workflow.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Branch } from "src/branch/branch.entity";
import { WorkflowException } from "./workflow.exception";
import { WorkflowValidation } from "./workflow.validation";
import { BranchException } from "src/branch/branch.exception";
import { BranchValidation } from "src/branch/branch.validation";
import { WorkflowExecutionStepStatus, WorkflowStatus } from "./workflow.constants";
import { Tracking } from "src/tracking/tracking.entity";
import { TrackingScheduler } from "src/tracking/tracking.scheduler";
import { RaybotCommandTypes } from "src/robot-connector/robot-connector.constants";
import { RobotConnectorClient } from "src/robot-connector/robot-connector.client";

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: Repository<Workflow>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Tracking) 
    private trackingRepository: Repository<Tracking>,
    private trackingScheduler: TrackingScheduler,
    private robotConnectorClient: RobotConnectorClient,
    @InjectMapper() private mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   *
   * @param {CreateWorkflowRequestDto} requestData The data to add workflow for branch
   * @returns {Promise<WorkflowResponseDto>}
   * @throws {BranchException} If branch not found
   * @throws {WorkflowException} If branch have a workflow, can not add
   * @throws {WorkflowException} If workflow does exist
   */
  async addNewWorkflow(
    requestData: CreateWorkflowRequestDto,
  ): Promise<WorkflowResponseDto> {
    const context = `${WorkflowService.name}.${this.addNewWorkflow.name}`;
    const branch = await this.branchRepository.findOneBy({
      slug: requestData.branch,
    });
    if (!branch) {
      this.logger.warn(`Branch ${requestData.branch} is not found`, context);
      throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);
    }

    const workflowByBranch = await this.workflowRepository.findOne({
      where: {
        branch: {
          slug: requestData.branch,
        },
      },
    });
    if (workflowByBranch) {
      this.logger.warn(
        `Branch ${requestData.branch} have a workflow, can not add`,
        context,
      );
      throw new WorkflowException(WorkflowValidation.BRANCH_HAVE_A_WORKFLOW);
    }

    const workflow = await this.workflowRepository.findOneBy({
      workflowId: requestData.workflowId,
    });
    if (workflow) {
      this.logger.warn(
        `Workflow ${requestData.workflowId} already exists`,
        context,
      );
      throw new WorkflowException(WorkflowValidation.WORKFLOW_DOES_EXIST);
    }

    const workflowData = this.mapper.map(
      requestData,
      CreateWorkflowRequestDto,
      Workflow,
    );
    Object.assign(workflowData, { branch });
    const newWorkflow = this.workflowRepository.create(workflowData);
    const createdWorkflow = await this.workflowRepository.save(newWorkflow);
    const workflowDto = this.mapper.map(
      createdWorkflow,
      Workflow,
      WorkflowResponseDto,
    );
    return workflowDto;
  }

  /**
   *
   * @param {string} branchSlug The slug of branch
   * @returns {Promise<WorkflowResponseDto>}
   */
  async getAllWorkflowByBranch(
    branchSlug: string,
  ): Promise<WorkflowResponseDto[]> {
    const context = `${WorkflowService.name}.${this.getAllWorkflowByBranch.name}`;
    const workflows = await this.workflowRepository.find({
      where: {
        branch: {
          slug: branchSlug,
        },
      },
    });

    const workflowsDto = this.mapper.mapArray(
      workflows,
      Workflow,
      WorkflowResponseDto,
    );
    return workflowsDto;
  }

  /**
   *
   * @param {string} slug The slug of workflow
   * @param {UpdateWorkflowRequestDto} request The data to update workflow
   * @returns {Promise<WorkflowResponseDto>}
   */
  async updateWorkflow(
    slug: string,
    requestData: UpdateWorkflowRequestDto,
  ): Promise<WorkflowResponseDto> {
    const context = `${WorkflowService.name}.${this.updateWorkflow.name}`;

    const workflow = await this.workflowRepository.findOneBy({ slug });
    if (!workflow) {
      this.logger.warn(WorkflowValidation.WORKFLOW_NOT_FOUND.message, context);
      throw new WorkflowException(WorkflowValidation.WORKFLOW_NOT_FOUND);
    }
    Object.assign(workflow, { workflowId: requestData.workflowId });
    const updatedWorkflow = await this.workflowRepository.save(workflow);
    const workflowDto = this.mapper.map(
      updatedWorkflow,
      Workflow,
      WorkflowResponseDto,
    );
    return workflowDto;
  }

  async cancelWorkflowExecution(): Promise<void> {
    const context = `${WorkflowService.name}.${this.cancelWorkflowExecution.name}`;
    const trackings = await this.trackingRepository.find({
      where: {
        status: In([WorkflowStatus.PENDING, WorkflowStatus.RUNNING]),
      },
    });
    // update immediately tracking status
    await this.trackingScheduler.updateTrackingAndOrderStatus(trackings);

    const updatedTrackings = await this.trackingRepository.find({
      where: {
        status: In([WorkflowStatus.PENDING, WorkflowStatus.RUNNING]),
      },
    });
    // get running trackings to cancel
    const runningTrackings = updatedTrackings.filter(tracking => tracking.status === WorkflowStatus.RUNNING);
    if(!_.isEmpty(runningTrackings)) {
      await this.validateCancelWorkflowExecutionPermission(_.first(updatedTrackings).workflowExecution);
      await this.robotConnectorClient.cancelWorkflowExecution(_.first(updatedTrackings).workflowExecution);
    }

    this.logger.warn(WorkflowValidation.NOT_FOUND_ANY_WORKFLOW_TO_CANCEL.message, context);
    throw new WorkflowException(WorkflowValidation.NOT_FOUND_ANY_WORKFLOW_TO_CANCEL);
  }

  async validateCancelWorkflowExecutionPermission(
    workflowExecutionId: string
  ): Promise<void> {
    const context = `${WorkflowService.name}.${this.validateCancelWorkflowExecutionPermission.name}`;
    // Check steps status
    const steps = await this.robotConnectorClient.getStepsByWorkflowExecutionId(
      workflowExecutionId
    );
    console.log({workflowExecutionId})
    console.log({steps})
    const stepsByStatusAndType = steps.reduce((acc, step) => {
      const type = step.node.definition.type;
    
      if (step.status === WorkflowExecutionStepStatus.COMPLETED) {
        acc.COMPLETED[type] = (acc.COMPLETED[type] || 0) + 1;
      }
    
      if (step.status === WorkflowExecutionStepStatus.RUNNING) {
        acc.RUNNING[type] = (acc.RUNNING[type] || 0) + 1;
      }
      if (step.status === WorkflowExecutionStepStatus.PENDING) {
        acc.PENDING[type] = (acc.RUNNING[type] || 0) + 1;
      }
    
      return acc;
    }, { 
      COMPLETED: {} as Record<string, number>, 
      RUNNING: {} as Record<string, number>,
      PENDING: {} as Record<string, number>,
    });

    console.log({stepsByStatusAndType})

    if(stepsByStatusAndType.RUNNING[RaybotCommandTypes.DROP_BOX]) {
      if(stepsByStatusAndType.RUNNING[RaybotCommandTypes.DROP_BOX] > 0) {
        this.logger.warn(WorkflowValidation.CANCEL_WORKFLOW_EXECUTION_DENIED.message, context);
        throw new WorkflowException(WorkflowValidation.CANCEL_WORKFLOW_EXECUTION_DENIED);
      }
    }

    if(stepsByStatusAndType.RUNNING[RaybotCommandTypes.LIFT_BOX]) {
      if(stepsByStatusAndType.RUNNING[RaybotCommandTypes.LIFT_BOX] > 0) {
        this.logger.warn(WorkflowValidation.CANCEL_WORKFLOW_EXECUTION_DENIED.message, context);
        throw new WorkflowException(WorkflowValidation.CANCEL_WORKFLOW_EXECUTION_DENIED);
      }
    }

    if(
      stepsByStatusAndType.COMPLETED[RaybotCommandTypes.DROP_BOX] && 
      stepsByStatusAndType.COMPLETED[RaybotCommandTypes.LIFT_BOX]
    ) {
      if (
        stepsByStatusAndType.COMPLETED[RaybotCommandTypes.DROP_BOX] >= 2 &&
        stepsByStatusAndType.COMPLETED[RaybotCommandTypes.LIFT_BOX] === 1
      ) {
        this.logger.warn(WorkflowValidation.CANCEL_WORKFLOW_EXECUTION_DENIED.message, context);
        throw new WorkflowException(WorkflowValidation.CANCEL_WORKFLOW_EXECUTION_DENIED);
      }
    }
  }
}

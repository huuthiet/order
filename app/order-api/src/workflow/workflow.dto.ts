import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateWorkflowRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The id of workflow', example: 'workflow-id' })
  @IsNotEmpty({ message: 'Invalid id of workflow' })
  workflowId: string;

  @AutoMap()
  @ApiProperty({ description: 'The slug of branch', example: '' })
  @IsNotEmpty({ message: 'Invalid slug of branch' })
  branch: string;
}
export class UpdateWorkflowRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The id of workflow', example: 'workflow-id' })
  @IsNotEmpty({ message: 'Invalid id of workflow' })
  workflowId: string;
}

export class WorkflowResponseDto {
  @AutoMap()
  workflowId: string;
}

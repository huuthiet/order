import { RaybotCommandTypes } from "./robot-connector.constants";

export class RobotResponseDto {
  status: string;
}

export class CreateWorkflowRequestDto {
  name: string;
  description: string;
}
export class WorkflowResponseDto {
  id: string;
  name: string;
}

export class RunWorkflowRequestDto {
  env: {
    raybot_id: string,
    table_location: string,
    order_code: string
  }
}

export class WorkflowExecutionResponseDto {
  workflowExecutionId: string;
}
export class GetWorkflowExecutionResponseDto {
  status: string;
}

export class CreateQRLocationRequestDto {
  name: string;
  qrCode: string;
}

export class UpdateQRLocationMetadataRequestDto {
  isAssigned?: boolean;
}

export class UpdateQRLocationRequestDto {
  name: string;
  qrCode: string;
  metadata: UpdateQRLocationMetadataRequestDto;
}
export class QRLocationArrayResponseDto {
  items: QRLocationResponseDto[];
  totalItems: number;
}
export class QRLocationResponseDto {
  id: string;
  name: string;
  qrCode: string;
  metadata: QRLocationMetadataResponseDto;
}

export class QRLocationMetadataResponseDto {
  isAssigned: boolean;
}

export class RaybotCommandRequestDto {
  type: RaybotCommandTypes;
  input: Record<string, any> = {};
}
export class RaybotCommandResponseDto {
  id: string;
  type: string;
  status: string;
  raybotId: string; 
}

export class WorkflowExecutionStepResponseDto {
  id: string;
  workflowExecutionId: string;
  node: WorkflowNodeResponseDto;
  status: string;
}

export class WorkflowNodeResponseDto {
  id: string;
  definition: NodeDefinitionResponseDto;
}

export class NodeDefinitionResponseDto {
  type: string;
}

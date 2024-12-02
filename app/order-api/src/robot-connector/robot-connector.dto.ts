export class RobotResponseDto {
  status: string
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
  order_code: string;
  location: string;
}

export class WorkflowExecutionResponseDto {
  workflow_execution_id: string;
}
export class GetWorkflowExecutionResponseDto {
  status: string;
}

export class CreateQRLocationRequestDto {
  name: string;
  qr_code: string;
}

export class UpdateQRLocationRequestDto {
  name: string;
  qr_code: string;
}
export class QRLocationResponseDto {
  id: string;
  name: string;
  qr_code: string;
}

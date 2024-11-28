export class CreateWorkflowRequestDto {
  name: string;
  description: string;
}
export class WorkFlowResponseDto {
  id: string;
  name: string;
}

export class RunWorkFlowRequestDto {
  order_code: string;
  location: string;
}

export class WorkFlowExecutionResponseDto {
  workflow_execution_id: string;
}
export class GetWorkFlowExecutionResponseDto {
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

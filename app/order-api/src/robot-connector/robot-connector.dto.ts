export class CreateWorkFlowRequestDto {
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
  id: string;
  status: string;
  workflow_id: string;
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

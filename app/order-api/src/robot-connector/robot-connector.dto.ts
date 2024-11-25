export class InitiateWorkFlowInstanceRequestDto {
  orderCode: string;
  location: string;
}

export class InitiateWorkFlowInstanceResponseDto {
  workFlowInstanceId: string;
}

export class RetrieveWorkFlowResponseDto {
  status: string
}
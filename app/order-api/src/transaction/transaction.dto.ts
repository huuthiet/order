export class UpdateTransactionStatusRequestDto {
  requestTrace: string;
  responseDateTime: string;
  responseStatus: {
    responseCode: string;
    responseMessage: string;
  };
  responseBody: {
    index: string;
    referenceCode: string;
  };
}

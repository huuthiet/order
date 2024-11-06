export class AppResponseDto<T> {
  statusCode: number;
  timestamp: string;
  method: string;
  path: string;
  result: T;
  message: string;
}

export class AppExceptionResponseDto extends AppResponseDto<void> {}

import { Injectable } from '@nestjs/common';
import { AppValidation, TErrorCode } from './app.validation';

@Injectable()
export class AppService {
  getErrorCodes(): TErrorCode {
    return AppValidation;
  }

  getHello(): string {
    return 'Hello World!';
  }
}

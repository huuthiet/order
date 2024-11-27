import { Injectable } from '@nestjs/common';
import { AppValidation, TErrorCode } from './app.validation';

@Injectable()
export class AppService {
  getErrorCodes(): TErrorCode {
    // Convert the object to an array of key-value pairs
    const sortedEntries = Object.entries(AppValidation).sort(
      ([, a], [, b]) => a.code - b.code,
    );

    // Convert the sorted array back to an object
    const sortedErrors = Object.fromEntries(sortedEntries);

    return sortedErrors;
  }

  getHello(): string {
    return 'Hello World!';
  }
}

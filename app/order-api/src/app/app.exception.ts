import { HttpException, HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';
import { getReasonPhrase } from 'http-status-codes';
import { TErrorCodeValue } from './app.validation';

export class AppException extends HttpException {
  protected _errorCodeValue: TErrorCodeValue;

  constructor(
    errorCodeValue: TErrorCodeValue | HttpStatus,
    message?: string,
    statusCode?: number,
  ) {
    // If error code value is TErrorCodeValue
    if (typeof errorCodeValue === 'object' && _.has(errorCodeValue, 'code')) {
      const { code, message: defaultMessage } =
        errorCodeValue as TErrorCodeValue;
      super(message || defaultMessage, statusCode || HttpStatus.BAD_REQUEST);
      this._errorCodeValue = {
        code,
        message: message || defaultMessage,
      };
      return;
    }

    // If error code value is HttpStatus
    if (typeof errorCodeValue === 'number') {
      const statusCode = errorCodeValue as HttpStatus;
      const reasonPhraseMessage = getReasonPhrase(statusCode);
      super(message || reasonPhraseMessage, statusCode);
      this._errorCodeValue = {
        code: statusCode,
        message: message || reasonPhraseMessage,
      };
      return;
    }
    // Fallback for unexpected error code types
    const fallbackMessage = 'Unknown error occurred';
    super(fallbackMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    this._errorCodeValue = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: fallbackMessage,
    };
  }

  public get errorCodeValue() {
    return this._errorCodeValue;
  }

  public set errorCodeValue(errorCodeValue: TErrorCodeValue) {
    this._errorCodeValue = errorCodeValue;
  }
}

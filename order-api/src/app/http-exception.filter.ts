import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { has } from 'lodash';
import { AppExceptionResponseDto } from './app.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let message = exception.message;
    if (
      typeof exceptionResponse === 'object' &&
      has(exceptionResponse, 'message')
    ) {
      const messages = exceptionResponse.message;
      message = Array.isArray(messages) ? messages[0] : messages; // Get the first error message if it's an array
    }

    const appResponseDto = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    } as AppExceptionResponseDto;
    response.status(status).json(appResponseDto);
  }
}

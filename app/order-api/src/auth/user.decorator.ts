import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { INVALID_USERID } from './auth.validation';

export class UserRequest {
  @IsNotEmpty({ message: INVALID_USERID })
  userId: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

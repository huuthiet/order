import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { INVALID_PHONENUMBER, INVALID_USERID } from './auth.validation';

export class UserRequest {
  @IsNotEmpty({ message: INVALID_USERID })
  userId: string;

  @IsNotEmpty({ message: INVALID_PHONENUMBER })
  phonenumber: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

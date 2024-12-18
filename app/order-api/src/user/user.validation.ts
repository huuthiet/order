import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const USER_NOT_FOUND = 'USER_NOT_FOUND';

export type TUserErrorCodeKey = typeof USER_NOT_FOUND;
export type TUserErrorCode = Record<TUserErrorCodeKey, TErrorCodeValue>;

// 137000 - 138000
export const UserValidation: TUserErrorCode = {
  USER_NOT_FOUND: createErrorCode(137000, 'User not found'),
};

import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const INVALID_PHONENUMBER = 'INVALID_PHONENUMBER';
export const INVALID_USERID = 'INVALID_USERID';
export const INVALID_PASSWORD = 'INVALID_PASSWORD';
export const INVALID_FIRSTNAME = 'INVALID_FIRSTNAME';
export const INVALID_LASTNAME = 'INVALID_LASTNAME';
export const USER_EXISTS = 'USER_EXISTS';
export const USER_NOT_FOUND = 'USER_NOT_FOUND';
export const INVALID_OLD_PASSWORD = 'INVALID_OLD_PASSWORD';

export type TAuthErrorCodeKey =
  | typeof INVALID_PHONENUMBER
  | typeof INVALID_PASSWORD
  | typeof INVALID_LASTNAME
  | typeof INVALID_USERID
  | typeof USER_EXISTS
  | typeof USER_NOT_FOUND
  | typeof INVALID_OLD_PASSWORD
  | typeof INVALID_FIRSTNAME;

export type TAuthErrorCode = Record<TAuthErrorCodeKey, TErrorCodeValue>;

const AuthValidation: TAuthErrorCode = {
  INVALID_PHONENUMBER: createErrorCode(1004, 'Phone number is required'),
  INVALID_PASSWORD: createErrorCode(1005, 'Password is required'),
  INVALID_FIRSTNAME: createErrorCode(1007, 'Full name is required'),
  INVALID_LASTNAME: createErrorCode(1008, 'Full name is required'),
  INVALID_USERID: createErrorCode(1009, 'User ID is required'),
  USER_EXISTS: createErrorCode(1010, 'User exist'),
  USER_NOT_FOUND: createErrorCode(1011, 'User not found'),
  INVALID_OLD_PASSWORD: createErrorCode(1026, 'Invalid old password'),
};

export default AuthValidation;

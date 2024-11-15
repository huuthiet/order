import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const INVALID_PHONENUMBER = 'INVALID_PHONENUMBER';
export const INVALID_PASSWORD = 'INVALID_PASSWORD';
export const INVALID_FIRSTNAME = 'INVALID_FIRSTNAME';
export const INVALID_LASTNAME = 'INVALID_LASTNAME';

export type TAuthErrorCodeKey =
  | typeof INVALID_PHONENUMBER
  | typeof INVALID_PASSWORD
  | typeof INVALID_LASTNAME
  | typeof INVALID_FIRSTNAME;

export type TAuthErrorCode = Record<TAuthErrorCodeKey, TErrorCodeValue>;

const AuthValidation: TAuthErrorCode = {
  INVALID_PHONENUMBER: createErrorCode(1004, 'Phone number is required'),
  INVALID_PASSWORD: createErrorCode(1005, 'Password is required'),
  INVALID_FIRSTNAME: createErrorCode(1007, 'Full name is required'),
  INVALID_LASTNAME: createErrorCode(1008, 'Full name is required'),
};

export default AuthValidation;

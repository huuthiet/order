import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const PAYMENT_QUERY_INVALID = 'PAYMENT_QUERY_INVALID';
export const PAYMENT_METHOD_INVALID = 'PAYMENT_METHOD_INVALID';
export const PAYMENT_NOT_FOUND = 'PAYMENT_NOT_FOUND';
export const TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND';

export type TPaymentErrorCodeKey =
  | typeof PAYMENT_QUERY_INVALID
  | typeof PAYMENT_NOT_FOUND
  | typeof TRANSACTION_NOT_FOUND
  | typeof PAYMENT_METHOD_INVALID;

export type TPaymentErrorCode = Record<TPaymentErrorCodeKey, TErrorCodeValue>;

export const PaymentValidation: TPaymentErrorCode = {
  PAYMENT_QUERY_INVALID: createErrorCode(1018, 'Payment query is invalid'),
  PAYMENT_METHOD_INVALID: createErrorCode(1019, 'Payment method is invalid'),
  PAYMENT_NOT_FOUND: createErrorCode(1020, 'Payment not found'),
  TRANSACTION_NOT_FOUND: createErrorCode(1022, 'Payment not found'),
};

import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const OWNER_NOT_FOUND = 'OWNER_NOT_FOUND';
export const ORDER_NOT_FOUND = 'ORDER_NOT_FOUND';
export const ORDER_STATUS_INVALID = 'ORDER_STATUS_INVALID';

export type TOrderErrorCodeKey =
  | typeof OWNER_NOT_FOUND
  | typeof ORDER_STATUS_INVALID
  | typeof ORDER_NOT_FOUND;

export type TOrderErrorCode = Record<TOrderErrorCodeKey, TErrorCodeValue>;

export const OrderValidation: TOrderErrorCode = {
  OWNER_NOT_FOUND: createErrorCode(1021, 'Owner invalid'),
  ORDER_NOT_FOUND: createErrorCode(1023, 'Order not found'),
  ORDER_STATUS_INVALID: createErrorCode(1027, 'Order status invalid'),
};

import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const OWNER_NOT_FOUND = 'OWNER_NOT_FOUND';
export const ORDER_SLUG_INVALID = 'ORDER_SLUG_INVALID';
export const SUBTOTAL_NOT_VALID = 'SUBTOTAL_NOT_VALID';
export const ORDER_NOT_FOUND = 'ORDER_NOT_FOUND';
export const ORDER_STATUS_INVALID = 'ORDER_STATUS_INVALID';
export const REQUEST_QUANTITY_EXCESS_CURRENT_QUANTITY =
  'REQUEST_QUANTITY_EXCESS_CURRENT_QUANTITY';
export const ORDER_TYPE_INVALID = 'ORDER_TYPE_INVALID';
export const CREATE_ORDER_ERROR = 'CREATE_ORDER_ERROR';
export const ORDER_ID_INVALID = 'ORDER_ID_INVALID';

export type TOrderErrorCodeKey =
  | typeof OWNER_NOT_FOUND
  | typeof ORDER_STATUS_INVALID
  | typeof ORDER_NOT_FOUND
  | typeof ORDER_SLUG_INVALID
  | typeof SUBTOTAL_NOT_VALID
  | typeof ORDER_TYPE_INVALID
  | typeof CREATE_ORDER_ERROR
  | typeof ORDER_ID_INVALID
  | typeof REQUEST_QUANTITY_EXCESS_CURRENT_QUANTITY;

export type TOrderErrorCode = Record<TOrderErrorCodeKey, TErrorCodeValue>;

// Error range: 101000 - 102000
export const OrderValidation: TOrderErrorCode = {
  OWNER_NOT_FOUND: createErrorCode(101000, 'Owner invalid'),
  ORDER_NOT_FOUND: createErrorCode(101001, 'Order not found'),
  ORDER_STATUS_INVALID: createErrorCode(101002, 'Order status invalid'),
  REQUEST_QUANTITY_EXCESS_CURRENT_QUANTITY: createErrorCode(
    101003,
    'Request quantity excess current quantity',
  ),
  ORDER_SLUG_INVALID: createErrorCode(101004, 'Order slug not found'),
  SUBTOTAL_NOT_VALID: createErrorCode(101005, 'Order subtotal is not valid'),
  ORDER_TYPE_INVALID: createErrorCode(101006, 'Order type is not valid'),
  CREATE_ORDER_ERROR: createErrorCode(101007, 'Error when saving order'),
  ORDER_ID_INVALID: createErrorCode(101008, 'Order id invalid'),
};

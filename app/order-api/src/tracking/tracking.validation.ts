import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const CREATE_TRACKING_FAILED = 'CREATE_TRACKING_FAILED';
export const CREATE_TRACKING_ERROR = 'CREATE_TRACKING_ERROR';
export const TRACKING_NOT_FOUND = 'TRACKING_NOT_FOUND';
export const WAIT_FOR_CURRENT_SHIPMENT_COMPLETED =
  'WAIT_FOR_CURRENT_SHIPMENT_COMPLETED';
export const ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT =
  'ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT';
export const ORDERS_MUST_BELONG_TO_ONE_TABLE =
  'ORDERS_MUST_BELONG_TO_ONE_TABLE';
export const INVALID_DATA_CREATE_TRACKING_ORDER_ITEM =
  'INVALID_DATA_CREATE_TRACKING_ORDER_ITEM';
export const DUPLICATE_ORDER_ITEM_WHEN_CONFIRM_SHIPMENT =
  'DUPLICATE_ORDER_ITEM_WHEN_CONFIRM_SHIPMENT';

export type TTrackingErrorCodeKey =
  | typeof CREATE_TRACKING_FAILED
  | typeof WAIT_FOR_CURRENT_SHIPMENT_COMPLETED
  | typeof ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT
  | typeof ORDERS_MUST_BELONG_TO_ONE_TABLE
  | typeof TRACKING_NOT_FOUND
  | typeof CREATE_TRACKING_ERROR
  | typeof INVALID_DATA_CREATE_TRACKING_ORDER_ITEM
  | typeof DUPLICATE_ORDER_ITEM_WHEN_CONFIRM_SHIPMENT;
export type TTrackingErrorCode = Record<TTrackingErrorCodeKey, TErrorCodeValue>;

// 129000 - 130000
export const TrackingValidation: TTrackingErrorCode = {
  CREATE_TRACKING_FAILED: createErrorCode(1041, 'Create tracking failed'),
  WAIT_FOR_CURRENT_SHIPMENT_COMPLETED: createErrorCode(
    129000,
    'Please wait for current shipment completed',
  ),
  ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT: createErrorCode(
    129001,
    'Order for take out, can not use robot',
  ),
  ORDERS_MUST_BELONG_TO_ONE_TABLE: createErrorCode(
    129002,
    'Orders must belong to one table',
  ),
  INVALID_DATA_CREATE_TRACKING_ORDER_ITEM: createErrorCode(
    129003,
    'Invalid data create tracking order item',
  ),
  TRACKING_NOT_FOUND: createErrorCode(129004, 'Tracking not found'),
  CREATE_TRACKING_ERROR: createErrorCode(129005, 'Create traking error'),
  DUPLICATE_ORDER_ITEM_WHEN_CONFIRM_SHIPMENT: createErrorCode(
    129006, 
    'Duplicate order item when create tracking'
  ),
};

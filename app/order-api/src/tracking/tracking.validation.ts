import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const CREATE_TRACKING_FAILED = 'CREATE_TRACKING_FAILED';
export const WAIT_FOR_CURRENT_SHIPMENT_COMPLETED = 'WAIT_FOR_CURRENT_SHIPMENT_COMPLETED';
export const ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT = 'ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT';
export const ORDERS_MUST_BELONG_TO_ONE_TABLE = 'ORDERS_MUST_BELONG_TO_ONE_TABLE';
export const INVALID_DATA_CREATE_TRACKING_ORDER_ITEM = 'INVALID_DATA_CREATE_TRACKING_ORDER_ITEM';

export type TTrackingErrorCodeKey =
  | typeof CREATE_TRACKING_FAILED
  | typeof WAIT_FOR_CURRENT_SHIPMENT_COMPLETED
  | typeof ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT
  | typeof ORDERS_MUST_BELONG_TO_ONE_TABLE
  | typeof INVALID_DATA_CREATE_TRACKING_ORDER_ITEM
export type TTrackingErrorCode = Record<TTrackingErrorCodeKey, TErrorCodeValue>;

export const TrackingValidation: TTrackingErrorCode = {
  CREATE_TRACKING_FAILED: createErrorCode(1041, 'Create tracking failed'),
  WAIT_FOR_CURRENT_SHIPMENT_COMPLETED: createErrorCode(1030, 'Please wait for current shipment completed'),
  ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT: createErrorCode(1039, 'Order for take out, can not use robot'),
  ORDERS_MUST_BELONG_TO_ONE_TABLE: createErrorCode(1049, 'Orders must belong to one table'),
  INVALID_DATA_CREATE_TRACKING_ORDER_ITEM: createErrorCode(1050, 'Invalid data create tracking order item'),
};

import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const CREATE_TRACKING_FAILED = 'CREATE_TRACKING_FAILED';
export const WAIT_FOR_CURRENT_SHIPMENT_COMPLETED = 'WAIT_FOR_CURRENT_SHIPMENT_COMPLETED';
export const ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT = 'ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT';

export type TTrackingErrorCodeKey =
  | typeof CREATE_TRACKING_FAILED
  | typeof WAIT_FOR_CURRENT_SHIPMENT_COMPLETED
  | typeof ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT
export type TTrackingErrorCode = Record<TTrackingErrorCodeKey, TErrorCodeValue>;

export const TrackingValidation: TTrackingErrorCode = {
  CREATE_TRACKING_FAILED: createErrorCode(1029, 'Create tracking failed'),
  WAIT_FOR_CURRENT_SHIPMENT_COMPLETED: createErrorCode(1030, 'Please wait for current shipment completed'),
  ORDER_TAKE_OUT_CAN_NOT_USE_ROBOT: createErrorCode(1039, 'Order for robot, can not use robot'),
};

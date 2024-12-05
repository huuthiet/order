import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const TABLE_NAME_EXIST = 'TABLE_NAME_EXIST';
export const TABLE_NOT_FOUND = 'TABLE_NOT_FOUND';
export const LOCATION_NOT_FOUND = 'LOCATION_NOT_FOUND';
export const LOCATION_ASSIGNED = 'LOCATION_ASSIGNED';

export type TTableErrorCodeKey =
  | typeof TABLE_NAME_EXIST
  | typeof TABLE_NOT_FOUND
  | typeof LOCATION_ASSIGNED
  | typeof LOCATION_NOT_FOUND;

export type TTableErrorCode = Record<TTableErrorCodeKey, TErrorCodeValue>;

export const TableValidation: TTableErrorCode = {
  TABLE_NAME_EXIST: createErrorCode(1024, 'Table name already exists'),
  TABLE_NOT_FOUND: createErrorCode(1025, 'Table not found'),
  LOCATION_NOT_FOUND: createErrorCode(1030, 'Location not found'),
  LOCATION_ASSIGNED: createErrorCode(1031, 'Location is already assigned'),
};

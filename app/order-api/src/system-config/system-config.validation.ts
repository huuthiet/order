import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const SYSTEM_CONFIG_KEY_INVALID = 'SYSTEM_CONFIG_KEY_INVALID';
export const SYSTEM_CONFIG_VALUE_INVALID = 'SYSTEM_CONFIG_VALUE_INVALID';
export const SYSTEM_CONFIG_NOT_FOUND = 'SYSTEM_CONFIG_NOT_FOUND';
export const CREATE_SYSTEM_CONFIG_ERROR = 'CREATE_SYSTEM_CONFIG_ERROR';
export const SYSTEM_CONFIG_QUERY_INVALID = 'SYSTEM_CONFIG_QUERY_INVALID';

export type TSystemConfigErrorCodeKey =
  | typeof SYSTEM_CONFIG_KEY_INVALID
  | typeof SYSTEM_CONFIG_NOT_FOUND
  | typeof CREATE_SYSTEM_CONFIG_ERROR
  | typeof SYSTEM_CONFIG_QUERY_INVALID
  | typeof SYSTEM_CONFIG_VALUE_INVALID;

export type TSystemConfigErrorCode = Record<
  TSystemConfigErrorCodeKey,
  TErrorCodeValue
>;

//140000 – 141000
export const SystemConfigValidation: TSystemConfigErrorCode = {
  SYSTEM_CONFIG_KEY_INVALID: createErrorCode(
    140000,
    'System config key invalid',
  ),
  SYSTEM_CONFIG_VALUE_INVALID: createErrorCode(
    140001,
    'System config value invalid',
  ),
  SYSTEM_CONFIG_NOT_FOUND: createErrorCode(140002, 'System config not found'),
  CREATE_SYSTEM_CONFIG_ERROR: createErrorCode(
    140003,
    'Error when creating system config',
  ),
  SYSTEM_CONFIG_QUERY_INVALID: createErrorCode(
    140004,
    'Error when creating system config',
  ),
};

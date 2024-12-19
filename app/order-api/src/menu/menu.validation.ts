import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const MENU_NOT_FOUND = 'MENU_NOT_FOUND';
export const TEMPLATE_EXIST = 'TEMPLATE_EXIST';
export const INVALID_DAY = 'INVALID_DAY';

export type TMenuErrorCodeKey =
  | typeof INVALID_DAY
  | typeof TEMPLATE_EXIST
  | typeof MENU_NOT_FOUND;

export type TMenuErrorCode = Record<TMenuErrorCodeKey, TErrorCodeValue>;

// 117000 - 118000
export const MenuValidation: TMenuErrorCode = {
  INVALID_DAY: createErrorCode(117001, 'Day is invalid'),
  MENU_NOT_FOUND: createErrorCode(117002, 'Menu not found'),
  TEMPLATE_EXIST: createErrorCode(117003, 'Template menu already exist'),
};

import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const INVALID_BRANCH_SLUG = 'INVALID_BRANCH_SLUG';
export const MENU_NOT_FOUND = 'MENU_NOT_FOUND';
export const TEMPLATE_EXIST = 'TEMPLATE_EXIST';
export const INVALID_DAY = 'INVALID_DAY';

export type TMenuErrorCodeKey =
  | typeof INVALID_BRANCH_SLUG
  | typeof INVALID_DAY
  | typeof TEMPLATE_EXIST
  | typeof MENU_NOT_FOUND;

export type TMenuErrorCode = Record<TMenuErrorCodeKey, TErrorCodeValue>;

export const MenuValidation: TMenuErrorCode = {
  INVALID_BRANCH_SLUG: createErrorCode(1001, 'Branch slug is invalid'),
  INVALID_DAY: createErrorCode(1002, 'Day is invalid'),
  MENU_NOT_FOUND: createErrorCode(1003, 'Menu not found'),
  TEMPLATE_EXIST: createErrorCode(1029, 'Template menu already exist'),
};

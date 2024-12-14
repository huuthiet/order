import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const VARIANT_NOT_FOUND = 'VARIANT_NOT_FOUND';
export const VARIANT_DOES_EXIST = 'VARIANT_DOES_EXIST';

export type TVariantErrorCodeKey = 
typeof VARIANT_NOT_FOUND
| typeof VARIANT_DOES_EXIST;

export type TVariantErrorCode = Record<TVariantErrorCodeKey, TErrorCodeValue>;

export const VariantValidation: TVariantErrorCode = {
  VARIANT_NOT_FOUND: createErrorCode(1028, 'Variant not found'),
  VARIANT_DOES_EXIST: createErrorCode(1052, 'Variant does exist'),
};

import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const VARIANT_NOT_FOUND = 'VARIANT_NOT_FOUND';

export type TVariantErrorCodeKey =
  | typeof VARIANT_NOT_FOUND

export type TVariantErrorCode = Record<TVariantErrorCodeKey, TErrorCodeValue>;

export const VariantValidation: TVariantErrorCode = {
  VARIANT_NOT_FOUND: createErrorCode(1027, 'Variant not found'),
};

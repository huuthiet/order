import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND';
export const PRODUCT_NAME_EXIST = 'PRODUCT_NAME_EXIST';
export const PRODUCT_NAME_REQUIRED = 'PRODUCT_NAME_REQUIRED';
export const PRODUCT_LIMIT_REQUIRED = 'PRODUCT_LIMIT_REQUIRED';
export const PRODUCT_ACTIVE_REQUIRED = 'PRODUCT_ACTIVE_REQUIRED';

export type TProductErrorCodeKey =
  | typeof PRODUCT_NOT_FOUND
  | typeof PRODUCT_NAME_EXIST
  | typeof PRODUCT_LIMIT_REQUIRED
  | typeof PRODUCT_ACTIVE_REQUIRED
  | typeof PRODUCT_NAME_REQUIRED;

export type TProductErrorCode = Record<TProductErrorCodeKey, TErrorCodeValue>;

const ProductValidation: TProductErrorCode = {
  PRODUCT_NOT_FOUND: createErrorCode(1013, 'Product not found'),
  PRODUCT_NAME_EXIST: createErrorCode(1014, 'Product name is existed'),
  PRODUCT_NAME_REQUIRED: createErrorCode(1015, 'Name product is required'),
  PRODUCT_LIMIT_REQUIRED: createErrorCode(
    1016,
    'The limit of product is required',
  ),
  PRODUCT_ACTIVE_REQUIRED: createErrorCode(
    1017,
    'The active of product is required',
  ),
};

export default ProductValidation;

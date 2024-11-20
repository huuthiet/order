import AuthValidation from 'src/auth/auth.validation1';
import { CatalogValidation } from 'src/catalog/catalog.validation';
import FileValidation from 'src/file/file.validation';
import { MenuValidation } from 'src/menu/menu.validation';
import ProductValidation from 'src/product/product.validation';

export type TErrorCodeValue = {
  code: number;
  message: string;
};
export type TErrorCode = Record<string, TErrorCodeValue>;

// Reusable function for creating error codes
export function createErrorCode(
  code: number,
  message: string,
): TErrorCodeValue {
  return { code, message };
}

export const AppValidation: TErrorCode = {
  ...AuthValidation,
  ...CatalogValidation,
  ...MenuValidation,
  ...FileValidation,
  ...ProductValidation,
};

const errorCodeKeys = Object.keys(AppValidation);
const errorCodeSet = new Set();

errorCodeKeys.forEach((key) => {
  const code = AppValidation[key].code;
  if (errorCodeSet.has(code)) {
    throw new Error(`Duplicate error code found: ${code}`);
  }
  errorCodeSet.add(code);
});

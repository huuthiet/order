import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const INVALID_CATALOG_NAME = 'INVALID_CATALOG_NAME';

export type CatalogErrorCodeKey = typeof INVALID_CATALOG_NAME;

export const CatalogValidation: Record<CatalogErrorCodeKey, TErrorCodeValue> = {
  INVALID_CATALOG_NAME: createErrorCode(1000, 'Catalog name is invalid'),
};

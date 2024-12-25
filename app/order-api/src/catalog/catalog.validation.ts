import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const INVALID_CATALOG_NAME = 'INVALID_CATALOG_NAME';
export const CATALOG_EXITS = 'CATALOG_EXITS';
export const CATALOG_NOT_FOUND = 'CATALOG_NOT_FOUND';
export const DELETE_CATALOG_ERROR = 'DELETE_CATALOG_ERROR';

export type TCatalogErrorCodeKey =
  | typeof INVALID_CATALOG_NAME
  | typeof CATALOG_NOT_FOUND
  | typeof DELETE_CATALOG_ERROR
  | typeof CATALOG_EXITS;

// 107000 - 108000
export const CatalogValidation: Record<TCatalogErrorCodeKey, TErrorCodeValue> =
  {
    INVALID_CATALOG_NAME: createErrorCode(107000, 'Catalog name is invalid'),
    CATALOG_EXITS: createErrorCode(107001, 'Catalog existed'),
    CATALOG_NOT_FOUND: createErrorCode(107002, 'Catalog not found'),
    DELETE_CATALOG_ERROR: createErrorCode(
      107003,
      'Must change catalog of products before delete this catalog',
    ),
  };

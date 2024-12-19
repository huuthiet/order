import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const EXPORT_DATABASE_ERROR = 'EXPORT_DATABASE_ERROR';
export const UPLOAD_DATABASE_ERROR = 'UPLOAD_DATABASE_ERROR';

export type TDbErrorCodeKey =
  | typeof EXPORT_DATABASE_ERROR
  | typeof UPLOAD_DATABASE_ERROR;

// 109000 - 110000
export const DbValidation: Record<TDbErrorCodeKey, TErrorCodeValue> = {
  EXPORT_DATABASE_ERROR: createErrorCode(109000, 'Export database error'),
  UPLOAD_DATABASE_ERROR: createErrorCode(
    109001,
    'Error when uploading database',
  ),
};

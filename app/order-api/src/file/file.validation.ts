import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const FILE_NOT_FOUND = 'FILE_NOT_FOUND';

export type TFileErrorCodeKey = typeof FILE_NOT_FOUND;

export type TFileErrorCode = Record<TFileErrorCodeKey, TErrorCodeValue>;

const FileValidation: TFileErrorCode = {
  FILE_NOT_FOUND: createErrorCode(1012, 'File not found'),
};

export default FileValidation;

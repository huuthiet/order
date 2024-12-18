import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const FILE_NOT_FOUND = 'FILE_NOT_FOUND';

export type TFileErrorCodeKey = typeof FILE_NOT_FOUND;

export type TFileErrorCode = Record<TFileErrorCodeKey, TErrorCodeValue>;

// 121000 - 122000
const FileValidation: TFileErrorCode = {
  FILE_NOT_FOUND: createErrorCode(121000, 'File not found'),
};

export default FileValidation;

import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const INVALID_BRANCH_NAME = 'INVALID_BRANCH_NAME';
export const INVALID_BRANCH_ADDRESS = 'INVALID_BRANCH_ADDRESS';

export type TBranchErrorCodeKey =
  | typeof INVALID_BRANCH_ADDRESS
  | typeof INVALID_BRANCH_NAME;

export type TBranchErrorCode = Record<TBranchErrorCodeKey, TErrorCodeValue>;

export const BranchValidation: TBranchErrorCode = {
  INVALID_BRANCH_ADDRESS: createErrorCode(1003, 'Invalid branch address'),
  INVALID_BRANCH_NAME: createErrorCode(1004, 'Invalid branch name'),
};

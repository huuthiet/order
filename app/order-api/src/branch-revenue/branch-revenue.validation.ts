import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const CREATE_BRANCH_REVENUE_ERROR = 'CREATE_BRANCH_REVENUE_ERROR';

export type TBranchRevenueErrorCodeKey = typeof CREATE_BRANCH_REVENUE_ERROR;

// 143001 – 143200
export type TBranchRevenueErrorCode = Record<
  TBranchRevenueErrorCodeKey,
  TErrorCodeValue
>;

export const BranchRevenueValidation: TBranchRevenueErrorCode = {
  CREATE_BRANCH_REVENUE_ERROR: createErrorCode(
    143001,
    'Error when creating branch revenues',
  ),
};

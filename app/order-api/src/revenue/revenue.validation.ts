import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const CREATE_REVENUE_ERROR = 'CREATE_REVENUE_ERROR';

export type TRevenueErrorCodeKey = typeof CREATE_REVENUE_ERROR;

// 143201 – 143400
export type TRevenueErrorCode = Record<TRevenueErrorCodeKey, TErrorCodeValue>;

export const RevenueValidation: TRevenueErrorCode = {
  CREATE_REVENUE_ERROR: createErrorCode(143201, 'Error when creating revenues'),
};

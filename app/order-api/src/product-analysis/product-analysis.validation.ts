import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const PRODUCT_ANALYSIS_NOT_FOUND = 'PRODUCT_ANALYSIS_NOT_FOUND';

export type TProductAnalysisErrorCodeKey = typeof PRODUCT_ANALYSIS_NOT_FOUND;

export type TProductAnalysisErrorCode = Record<
  TProductAnalysisErrorCodeKey,
  TErrorCodeValue
>;

// 139501 - 139999
export const ProductAnalysisValidation: TProductAnalysisErrorCode = {
  PRODUCT_ANALYSIS_NOT_FOUND: createErrorCode(
    139501,
    'Product analysis not found',
  ),
};

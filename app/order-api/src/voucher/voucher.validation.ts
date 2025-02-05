import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const VOUCHER_NOT_FOUND = 'VOUCHER_NOT_FOUND';
export const CREATE_VOUCHER_FAILED = 'CREATE_VOUCHER_FAILED';

export type TVoucherErrorCodeKey =
  | typeof VOUCHER_NOT_FOUND
  | typeof CREATE_VOUCHER_FAILED;
export type TVoucherErrorCode = Record<TVoucherErrorCodeKey, TErrorCodeValue>;

// 143401 – 144000
export const VoucherValidation: TVoucherErrorCode = {
  VOUCHER_NOT_FOUND: createErrorCode(143401, 'Voucher not found'),
  CREATE_VOUCHER_FAILED: createErrorCode(143402, 'Failed to create voucher'),
};

import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const CREATE_INVOICE_ERROR = 'CREATE_INVOICE_ERROR';
export const INVALID_QUERY = 'INVALID_QUERY';

export type TInvoiceErrorCodeKey =
  | typeof CREATE_INVOICE_ERROR
  | typeof INVALID_QUERY;

// 111000 - 112000
export const InvoiceValidation: Record<TInvoiceErrorCodeKey, TErrorCodeValue> =
  {
    CREATE_INVOICE_ERROR: createErrorCode(
      111000,
      'Error when creating invoice',
    ),
    INVALID_QUERY: createErrorCode(1, 'Query param invalid'),
  };

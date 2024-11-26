import { ACBConnectorClient } from './acb-connector.client';

export const X_CLIENT_ID = 'X-Client-ID';
export const X_OWNER_NUMBER = 'X-Owner-Number';
export const X_OWNER_TYPE = 'X-Owner-Type';
export const X_PROVIDER_ID = 'X-Provider-ID';
export const X_REQUEST_ID = 'X-Request-ID';

export enum ACBConnectorStatus {
  SUCCESS = '00000000',
  CLIENT_PARAMS_INVALID = '30020401',
  SOMETHING_WENT_WRONG = '30020500',
  TRANSACTION_DUPPLICATE = '30020055',
  VIRTUAL_ACCOUNT_PREFIX_INVALID = '30020056',
  BAD_REQUEST = '30020400',
  INVALID_TOKEN = '42020182',
  MISSING_TOKEN = '42020186',
  OWNER_VALIDATION_ERROR = '30020057',
}

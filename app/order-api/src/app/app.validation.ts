import AuthValidation from 'src/auth/auth.validation1';
import { CatalogValidation } from 'src/catalog/catalog.validation';
import FileValidation from 'src/file/file.validation';
import { MenuValidation } from 'src/menu/menu.validation';
import { OrderItemValidation } from 'src/order-item/order-item.validation';
import { OrderValidation } from 'src/order/order.validation';
import { PaymentValidation } from 'src/payment/payment.validation';
import ProductValidation from 'src/product/product.validation';
import { RobotConnectorValidation } from 'src/robot-connector/robot-connector.validation';
import { TableValidation } from 'src/table/table.validation';
import { TrackingValidation } from 'src/tracking/tracking.validation';
import { VariantValidation } from 'src/variant/variant.validation';
import { WorkflowValidation } from 'src/workflow/workflow.validation';

export type TErrorCodeValue = {
  code: number;
  message: string;
};
export type TErrorCode = Record<string, TErrorCodeValue>;

// Reusable function for creating error codes
export function createErrorCode(
  code: number,
  message: string,
): TErrorCodeValue {
  return { code, message };
}

export const AppValidation: TErrorCode = {
  ...CatalogValidation,
  ...MenuValidation,
  ...AuthValidation,
  ...FileValidation,
  ...ProductValidation,
  ...PaymentValidation,
  ...OrderValidation,
  ...TableValidation,
  ...VariantValidation,
  ...TrackingValidation,
  ...OrderItemValidation,
  ...WorkflowValidation,
  ...RobotConnectorValidation,
};

const errorCodeKeys = Object.keys(AppValidation);
const errorCodeSet = new Set();

errorCodeKeys.forEach((key) => {
  const code = AppValidation[key].code;
  if (errorCodeSet.has(code)) {
    throw new Error(`Duplicate error code found: ${code}`);
  }
  errorCodeSet.add(code);
});

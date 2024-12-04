import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const ROBOT_BUSY = 'ROBOT_BUSY';
export const GET_ROBOT_DATA_FAILED = 'GET_ROBOT_DATA_FAILED';
export const RUN_WORKFLOW_FROM_ROBOT_API_FAILED = 'RUN_WORKFLOW_FROM_ROBOT_API_FAILED';

export type TRobotConnectorErrorCodeKey =
  | typeof ROBOT_BUSY
  | typeof GET_ROBOT_DATA_FAILED
  | typeof RUN_WORKFLOW_FROM_ROBOT_API_FAILED
export type TRobotConnectorErrorCode = Record<TRobotConnectorErrorCodeKey, TErrorCodeValue>;

export const RobotConnectorValidation: TRobotConnectorErrorCode = {
  ROBOT_BUSY: createErrorCode(1037, 'Robot busy'),
  GET_ROBOT_DATA_FAILED: createErrorCode(1038, 'Get robot data failed'),
  RUN_WORKFLOW_FROM_ROBOT_API_FAILED: createErrorCode(1040, 'Run workflow from ROBOT API failed'),
};

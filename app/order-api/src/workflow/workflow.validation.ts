import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const MUST_ADD_WORKFLOW_FOR_BRANCH = 'MUST_ADD_WORKFLOW_FOR_BRANCH';

export type TWorkflowErrorCodeKey =
  | typeof MUST_ADD_WORKFLOW_FOR_BRANCH
export type TWorkflowErrorCode = Record<TWorkflowErrorCodeKey, TErrorCodeValue>;

export const WorkflowValidation: TWorkflowErrorCode = {
  MUST_ADD_WORKFLOW_FOR_BRANCH: createErrorCode(1036, 'Must add workflow for branch'),
};

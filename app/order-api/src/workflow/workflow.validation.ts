import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const MUST_ADD_WORKFLOW_FOR_BRANCH = 'MUST_ADD_WORKFLOW_FOR_BRANCH';
export const WORKFLOW_NOT_FOUND = 'WORKFLOW_NOT_FOUND';

export type TWorkflowErrorCodeKey =
  | typeof MUST_ADD_WORKFLOW_FOR_BRANCH
  | typeof WORKFLOW_NOT_FOUND
export type TWorkflowErrorCode = Record<TWorkflowErrorCodeKey, TErrorCodeValue>;

export const WorkflowValidation: TWorkflowErrorCode = {
  MUST_ADD_WORKFLOW_FOR_BRANCH: createErrorCode(1036, 'Must add workflow for branch'),
  WORKFLOW_NOT_FOUND: createErrorCode(1046, 'Workflow not found'),
};

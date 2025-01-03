import { createErrorCode, TErrorCodeValue } from 'src/app/app.validation';

export const MUST_ADD_WORKFLOW_FOR_BRANCH = 'MUST_ADD_WORKFLOW_FOR_BRANCH';
export const WORKFLOW_NOT_FOUND = 'WORKFLOW_NOT_FOUND';
export const WORKFLOW_DOES_EXIST = 'WORKFLOW_DOES_EXIST';
export const BRANCH_HAVE_A_WORKFLOW = 'BRANCH_HAVE_A_WORKFLOW';
export const CANCEL_WORKFLOW_EXECUTION_DENIED = 'CANCEL_WORKFLOW_EXECUTION_DENIED';
export const NOT_FOUND_ANY_WORKFLOW_TO_CANCEL = 'NOT_FOUND_ANY_WORKFLOW_TO_CANCEL';

export type TWorkflowErrorCodeKey =
  | typeof MUST_ADD_WORKFLOW_FOR_BRANCH
  | typeof WORKFLOW_NOT_FOUND
  | typeof WORKFLOW_DOES_EXIST
  | typeof BRANCH_HAVE_A_WORKFLOW
  | typeof CANCEL_WORKFLOW_EXECUTION_DENIED
  | typeof NOT_FOUND_ANY_WORKFLOW_TO_CANCEL
export type TWorkflowErrorCode = Record<TWorkflowErrorCodeKey, TErrorCodeValue>;

// 133000 - 134000
export const WorkflowValidation: TWorkflowErrorCode = {
  MUST_ADD_WORKFLOW_FOR_BRANCH: createErrorCode(133000, 'Must add workflow for branch'),
  WORKFLOW_NOT_FOUND: createErrorCode(133001, 'Workflow not found'),
  WORKFLOW_DOES_EXIST: createErrorCode(133002, 'Workflow does exist'),
  BRANCH_HAVE_A_WORKFLOW: 
    createErrorCode(133003, 'Branch have a workflow, can not add'),
  CANCEL_WORKFLOW_EXECUTION_DENIED: 
    createErrorCode(133004, 'Cancel workflow execution denied'),
    NOT_FOUND_ANY_WORKFLOW_TO_CANCEL: 
    createErrorCode(133005, 'Not found any workflow to cancel'),
};

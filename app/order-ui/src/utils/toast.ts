import toast from 'react-hot-toast'
import i18next from 'i18next'

const errorCodes: { [key: number]: string } = {
  401: 'toast.unauthorized',
  1000: 'toast.catalogNameInvalid',
  1001: 'toast.branchSlugInvalid',
  1002: 'toast.dayInvalid',
  1003: 'toast.menuNotFound',
  1004: 'toast.phoneNumberRequired',
  1005: 'toast.passwordRequired',
  1007: 'toast.firstNameRequired',
  1008: 'toast.lastNameRequired',
  1009: 'toast.userIdRequired',
  1010: 'toast.userExists',
  1011: 'toast.userNotFound',
  1012: 'toast.fileNotFound',
  1013: 'toast.productNotFound',
  1014: 'toast.productNameExist',
  1015: 'toast.productNameRequired',
  1016: 'toast.productLimitRequired',
  1017: 'toast.productActiveRequired',
  1018: 'toast.paymentQueryInvalid',
  1019: 'toast.paymentMethodInvalid',
  1020: 'toast.paymentNotFound',
  1021: 'toast.ownerNotFound',
  1022: 'toast.transactionNotFound',
  1023: 'toast.orderNotFound',
  1024: 'toast.tableNameExist',
  1025: 'toast.tableNotFound',
  1026: 'toast.invalidOldPassword',
  1027: 'toast.orderStatusInvalid',
  1028: 'toast.variantNotFound',
  1029: 'toast.templateExist',
  1030: 'toast.waitForCurrentShipmentCompleted',
  1031: 'toast.orderItemNotFound',
  1032: 'toast.orderItemNotBelongToAnyOrder',
  1033: 'toast.requestOrderItemGreaterOrderItemQuantity',
  1034: 'toast.allOrderItemMustBelongToAOrder',
  1035: 'toast.tableDoNotHaveLocation',
  1036: 'toast.mustAddWorkflowForBranch',
  1037: 'toast.robotBusy',
  1038: 'toast.getRobotDataFailed',
  1039: 'toast.orderTakeOutCannotUseRobot',
  1040: 'toast.runWorkflowFromRobotApiFailed',
  1041: 'toast.createTrackingFailed',
  1042: 'toast.locationNotFound',
  1043: 'toast.locationAssigned',
  1044: 'toast.productNotFoundInTodayMenu',
  1045: 'toast.requestQuantityExcessCurrentQuantity',
  1046: 'toast.forgotTokenExpired',
  1047: 'toast.workflowNotFound',
  1048: 'toast.getLocationFromRobotApiFailed',
  1049: 'toast.ordersMustBelongToOneTable',
  1050: 'toast.invalidDataCreateTrackingOrderItem',
  1051: 'toast.sizeNotFound',
  1052: 'toast.variantDoesExist',
  1053: 'toast.sizeNameDoesExist',
  1054: 'toast.mustChangeSizeOfVariantsBeforeDelete',
  1055: 'toast.workflowDoesExist',
  1056: 'toast.branchHaveAWorkflow',
  // Add any missing error codes from the response as needed
}

export function showToast(message: string) {
  toast.success(i18next.t(message, { ns: 'toast' }))
}

export function showErrorToast(code: number) {
  const messageKey = errorCodes[code] || 'toast.requestFailed'
  toast.error(i18next.t(messageKey, { ns: 'toast' }))
}

export function useErrorToast(code: number) {
  const messageKey = errorCodes[code] || 'toast.requestFailed'
  toast.error(i18next.t(messageKey, { ns: 'toast' }))
}

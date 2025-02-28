import toast from 'react-hot-toast'
import i18next from 'i18next'

// Map error codes from JSON to corresponding toast messages
const errorCodes: { [key: number]: string } = {
  1: 'toast.invalidQuery',
  401: 'toast.unauthorized',
  403: 'toast.forbidden',
  119010: 'toast.invalidCredentials',
  11000: 'toast.branchRequired',
  1031: 'toast.orderItemNotFound',
  1041: 'toast.createTrackingFailed',
  1042: 'toast.unloggedIn',
  101000: 'toast.ownerNotFound',
  101001: 'toast.orderNotFound',
  101002: 'toast.orderStatusInvalid',
  101003: 'toast.requestQuantityExcessCurrentQuantity',
  101004: 'toast.orderSlugInvalid',
  101005: 'toast.subtotalNotValid',
  101006: 'toast.orderTypeInvalid',
  101007: 'toast.createOrderError',
  101008: 'toast.orderIdInvalid',
  101009: 'toast.orderInvalid',
  103000: 'toast.acbConnectorConfigNotFound',
  103001: 'toast.xOwnerNumberInvalid',
  103002: 'toast.xOwnerTypeInvalid',
  103003: 'toast.xProviderIdInvalid',
  103004: 'toast.beneficiaryNameInvalid',
  103005: 'toast.virtualAccountPrefixInvalid',
  103006: 'toast.xServiceInvalid',
  103007: 'toast.acbConnectorConfigExist',
  103008: 'toast.getAcbTokenFail',
  103009: 'toast.initiateQrCodeFail',
  107000: 'toast.invalidCatalogName',
  107001: 'toast.catalogExists',
  107002: 'toast.catalogNotFound',
  107003: 'toast.deleteCatalogError',
  109000: 'toast.exportDatabaseError',
  109001: 'toast.uploadDatabaseError',
  111000: 'toast.createInvoiceError',
  113000: 'toast.menuItemNotFound',
  113001: 'toast.menuItemExist',
  115000: 'toast.productNotFound',
  115001: 'toast.productNameExist',
  115002: 'toast.productNameRequired',
  115003: 'toast.productLimitRequired',
  115004: 'toast.productActiveRequired',
  115005: 'toast.productNotFoundInTodayMenu',
  117001: 'toast.invalidDay',
  117002: 'toast.menuNotFound',
  117003: 'toast.templateExist',
  119000: 'toast.invalidPhoneNumber',
  119001: 'toast.invalidPassword',
  119002: 'toast.invalidFirstName',
  119003: 'toast.invalidLastName',
  119004: 'toast.invalidUserId',
  119005: 'toast.userExists',
  119007: 'toast.invalidOldPassword',
  119008: 'toast.forgotTokenExpired',
  121000: 'toast.fileNotFound',
  123000: 'toast.paymentQueryInvalid',
  123001: 'toast.paymentMethodInvalid',
  123002: 'toast.paymentNotFound',
  123003: 'toast.transactionNotFound',
  125000: 'toast.tableNameExist',
  125001: 'toast.tableNotFound',
  125002: 'toast.tableDoNotHaveLocation',
  125003: 'toast.locationNotFound',
  125004: 'toast.locationAssigned',
  127000: 'toast.variantNotFound',
  127001: 'toast.variantDoesExist',
  129000: 'toast.waitForCurrentShipmentCompleted',
  129001: 'toast.orderTakeOutCannotUseRobot',
  129002: 'toast.ordersMustBelongToOneTable',
  129003: 'toast.invalidDataCreateTrackingOrderItem',
  129004: 'toast.trackingNotFound',
  129005: 'toast.createTrackingError',
  131000: 'toast.orderItemNotBelongToAnyOrder',
  131001: 'toast.requestOrderItemGreaterOrderItemQuantity',
  131002: 'toast.allOrderItemMustBelongToAOrder',
  133000: 'toast.mustAddWorkflowForBranch',
  133001: 'toast.workflowNotFound',
  133002: 'toast.workflowDoesExist',
  133003: 'toast.branchHaveAWorkflow',
  135000: 'toast.robotBusy',
  135001: 'toast.getRobotDataFailed',
  135002: 'toast.runWorkflowFromRobotApiFailed',
  135003: 'toast.getLocationFromRobotApiFailed',
  135501: 'toast.sizeNotFound',
  135502: 'toast.sizeNameDoesExist',
  135503: 'toast.mustChangeSizeOfVariantsBeforeDelete',
  137000: 'toast.userNotFound',
  139000: 'toast.roleNotFound',
  140000: 'toast.systemConfigKeyInvalid',
  140001: 'toast.systemConfigValueInvalid',
  140002: 'toast.systemConfigNotFound',
  140003: 'toast.createSystemConfigError',
  140004: 'toast.systemConfigQueryInvalid',
  140005: 'toast.systemConfigInvalid',
  143202: 'toast.newRevenueNotFound',
  143407: 'toast.voucherAlreadyUsed',

  // client error
  1000: 'toast.voucherNotFound',
  1001: 'toast.minOrderNotMet',
  1002: 'toast.voucherExpired',
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

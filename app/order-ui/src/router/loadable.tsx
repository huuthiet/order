import React from 'react'

// Layout
export const StaffLayout = React.lazy(() =>
  import('@/app/layouts/system').then((module) => ({
    default: module.StaffLayout,
  })),
)

//Auth
export const LoginPage = React.lazy(() =>
  import('@/app/auth').then((module) => ({
    default: module.LoginPage,
  })),
)

export const RegisterPage = React.lazy(() =>
  import('@/app/auth').then((module) => ({
    default: module.RegisterPage,
  })),
)

//Views

//Home page
export const HomePage = React.lazy(() =>
  import('@/app/system/home').then((module) => ({
    default: module.HomePage,
  })),
)

//Menu page
export const MenuPage = React.lazy(() =>
  import('@/app/system/menu').then((module) => ({
    default: module.MenuPage,
  })),
)
export const CartContent = React.lazy(() =>
  import('@/app/system/menu').then((module) => ({
    default: module.CartContent,
  })),
)

export const ConfirmOrderPage = React.lazy(() =>
  import('@/app/system/menu').then((module) => ({
    default: module.ConfirmOrderPage,
  })),
)

export const OrderSuccessPage = React.lazy(() =>
  import('@/app/system/menu').then((module) => ({
    default: module.OrderSuccessPage,
  })),
)

//Order management page
export const OrderManagementPage = React.lazy(() =>
  import('@/app/system/order-management').then((module) => ({
    default: module.OrderManagementPage,
  })),
)

//Table page
export const TablePage = React.lazy(() =>
  import('@/app/system/table').then((module) => ({
    default: module.TablePage,
  })),
)

//Product page
export const ProductManagementPage = React.lazy(() =>
  import('@/app/system/dishes').then((module) => ({
    default: module.ProductManagementPage,
  })),
)

//Menu page
export const MenuManagementPage = React.lazy(() =>
  import('@/app/system/menu-management').then((module) => ({
    default: module.MenuManagementPage,
  })),
)

export const MenuDetailPage = React.lazy(() =>
  import('@/app/system/menu-management').then((module) => ({
    default: module.MenuDetailPage,
  })),
)

export const ProductDetailPage = React.lazy(() =>
  import('@/app/system/dishes').then((module) => ({
    default: module.ProductDetail,
  })),
)

//Log page
export const LoggerPage = React.lazy(() =>
  import('@/app/system/logger').then((module) => ({
    default: module.LoggerPage,
  })),
)

//Profile page
export const ProfilePage = React.lazy(() =>
  import('@/app/system/profile').then((module) => ({
    default: module.ProfilePage,
  })),
)

//Order payment page
export const OrderPaymentPage = React.lazy(() =>
  import('@/app/system/payment').then((module) => ({
    default: module.PaymentPage,
  })),
)

//Bank config page
export const BankConfigPage = React.lazy(() =>
  import('@/app/system/payment').then((module) => ({
    default: module.BankConfigPage,
  })),
)

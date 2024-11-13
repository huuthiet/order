import React from 'react'

// Layout
export const StaffLayout = React.lazy(() =>
  import('@/app/layouts/system').then((module) => ({
    default: module.StaffLayout
  }))
)

//Auth
export const LoginPage = React.lazy(() =>
  import('@/app/auth').then((module) => ({
    default: module.LoginPage
  }))
)

//Views

//Home page
export const HomePage = React.lazy(() =>
  import('@/app/system/home').then((module) => ({
    default: module.HomePage
  }))
)

//Menu page
export const MenuPage = React.lazy(() =>
  import('@/app/system/menu').then((module) => ({
    default: module.MenuPage
  }))
)
export const CartContent = React.lazy(() =>
  import('@/app/system/menu').then((module) => ({
    default: module.CartContent
  }))
)

export const ConfirmOrderPage = React.lazy(() =>
  import('@/app/system/menu').then((module) => ({
    default: module.ConfirmOrderPage
  }))
)

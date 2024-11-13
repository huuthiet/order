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
export const HomePage = React.lazy(() =>
  import('@/app/system/home').then((module) => ({
    default: module.HomePage
  }))
)
export const CartContent = React.lazy(() =>
  import('@/app/system/home').then((module) => ({
    default: module.CartContent
  }))
)

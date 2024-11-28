import { createBrowserRouter } from 'react-router-dom'

// import { Authority, ROUTE } from '@/constants'
import { Suspense } from 'react'
import { SkeletonCart } from '@/components/app/skeleton'
import { SuspenseElement } from '@/components/app/elements'
import { ROUTE } from '@/constants'
import {
  HomePage,
  MenuPage,
  StaffLayout,
  LoginPage,
  ConfirmOrderPage,
  TablePage,
  OrderSuccessPage,
  RegisterPage,
  ProductManagementPage,
  LoggerPage,
  ProductDetailPage,
  ProfilePage,
  MenuManagementPage,
  OrderPaymentPage,
  BankConfigPage,
  MenuDetailPage,
  OrderManagementPage,
} from './loadable'
import ProtectedElement from '@/components/app/elements/protected-element'

export const router = createBrowserRouter([
  { path: ROUTE.LOGIN, element: <SuspenseElement component={LoginPage} /> },
  {
    path: ROUTE.REGISTER,
    element: <SuspenseElement component={RegisterPage} />,
  },
  {
    path: ROUTE.STAFF_HOME,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={HomePage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_MENU,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={MenuPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_CHECKOUT_ORDER,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={ConfirmOrderPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_ORDER_PAYMENT}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={OrderPaymentPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.ORDER_SUCCESS,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={OrderSuccessPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_ORDER_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={OrderManagementPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_TABLE_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={TablePage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_PRODUCT_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={ProductManagementPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_PRODUCT_DETAIL}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={ProductDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_MENU_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={MenuManagementPage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_MENU_DETAIL}/:slug`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={MenuDetailPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.STAFF_LOG_MANAGEMENT,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={LoggerPage} />}
          />
        ),
      },
    ],
  },
  {
    path: ROUTE.PROFILE,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={ProfilePage} />}
          />
        ),
      },
    ],
  },
  {
    path: `${ROUTE.STAFF_BANK_CONFIG}`,
    element: (
      <Suspense fallback={<SkeletonCart />}>
        <SuspenseElement component={StaffLayout} />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedElement
            // allowedAuthorities={[Authority.READ_USER]}
            element={<SuspenseElement component={BankConfigPage} />}
          />
        ),
      },
    ],
  },
  // {
  //   path: ROUTE.PERSONAL_ACCOUNT,
  //   element: <SuspenseElement component={DashboardLayout} />,
  //   children: [
  //     {
  //       index: true,
  //       element: (
  //         <ProtectedElement
  //           allowedAuthorities={[Authority.READ_USER]}
  //           element={<SuspenseElement component={PersonalAccountPage} />}
  //         />
  //       )
  //     }
  //   ]
  // },
])

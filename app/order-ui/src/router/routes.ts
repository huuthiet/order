import {
  Banknote,
  ClipboardList,
  CookingPot,
  FileChartColumnIncreasing,
  FileText,
  Grid2x2,
  LayoutGrid,
  SquareTerminal,
  Wallet,
} from 'lucide-react'
import type { ISidebarRoute } from '@/types'
import { ROUTE } from '@/constants'

export const sidebarRoutes: ISidebarRoute[] = [
  {
    title: 'sidebar.home',
    path: ROUTE.STAFF_HOME,
    icon: SquareTerminal,
  },
  {
    title: 'sidebar.menu',
    path: ROUTE.STAFF_MENU,
    icon: LayoutGrid,
  },
  {
    title: 'sidebar.orderManagement',
    path: ROUTE.STAFF_ORDER_MANAGEMENT,
    icon: FileChartColumnIncreasing,
  },
  {
    title: 'sidebar.orderHistory',
    path: ROUTE.STAFF_ORDER_HISTORY,
    icon: FileText,
  },
  {
    title: 'sidebar.tableManagement',
    path: ROUTE.STAFF_TABLE_MANAGEMENT,
    icon: Grid2x2,
  },
  {
    title: 'sidebar.internalWallet',
    path: ROUTE.STAFF_WALLET_MANAGEMENT,
    icon: Wallet,
  },
  {
    title: 'sidebar.menuManagement',
    path: ROUTE.STAFF_MENU_MANAGEMENT,
    icon: ClipboardList,
  },
  {
    title: 'sidebar.dishManagement',
    path: ROUTE.STAFF_PRODUCT_MANAGEMENT,
    icon: CookingPot,
  },
  {
    title: 'sidebar.logManagement',
    path: ROUTE.STAFF_LOG_MANAGEMENT,
    icon: FileChartColumnIncreasing,
  },
  {
    title: 'sidebar.bankConfig',
    path: ROUTE.STAFF_BANK_CONFIG,
    icon: Banknote,
  },
]

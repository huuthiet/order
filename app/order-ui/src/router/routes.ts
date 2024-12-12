import {
  Banknote,
  Bolt,
  ClipboardList,
  CookingPot,
  FileChartColumnIncreasing,
  FileText,
  Grid2x2,
  LayoutGrid,
  SquareTerminal,
  Users,
  Wallet,
} from 'lucide-react'
import type { ISidebarRoute } from '@/types'
import { Role, ROUTE } from '@/constants'

export const sidebarRoutes: ISidebarRoute[] = [
  {
    title: 'sidebar.home',
    path: ROUTE.STAFF_HOME,
    icon: SquareTerminal,
    roles: [Role.ADMIN, Role.CUSTOMER],
  },
  {
    title: 'sidebar.menu',
    path: ROUTE.STAFF_MENU,
    icon: LayoutGrid,
    roles: [Role.ADMIN, Role.STAFF, Role.CUSTOMER],
  },
  {
    title: 'sidebar.orderManagement',
    path: ROUTE.STAFF_ORDER_MANAGEMENT,
    roles: [Role.MANAGER, Role.ADMIN],
    icon: FileChartColumnIncreasing,
  },
  {
    title: 'sidebar.orderHistory',
    path: ROUTE.STAFF_ORDER_HISTORY,
    roles: [Role.MANAGER, Role.ADMIN],
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
    title: 'sidebar.userManagement',
    path: ROUTE.STAFF_USER_MANAGEMENT,
    roles: [Role.ADMIN],
    icon: Users,
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
  {
    title: 'sidebar.config',
    path: ROUTE.ADMIN_CONFIG,
    icon: Bolt,
  },
]

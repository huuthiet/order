import {
  ClipboardList,
  CookingPot,
  FileText,
  Grid2x2,
  LayoutGrid,
  SquareTerminal,
  Wallet
} from 'lucide-react'
import type { ISidebarRoute } from '@/types'
import { ROUTE } from '@/constants'

export const sidebarRoutes: ISidebarRoute[] = [
  {
    title: 'Trang chủ',
    path: ROUTE.STAFF_HOME,
    icon: SquareTerminal
  },
  {
    title: 'Thực đơn',
    path: ROUTE.STAFF_MENU,
    icon: LayoutGrid
  },
  {
    title: 'Lịch sử đơn hàng',
    path: ROUTE.STAFF_ORDER_HISTORY,
    icon: FileText
  },
  {
    title: 'Quản lý bàn',
    path: ROUTE.STAFF_TABLE_MANAGEMENT,
    icon: Grid2x2
  },
  {
    title: 'Ví nội bộ',
    path: ROUTE.STAFF_WALLET_MANAGEMENT,
    icon: Wallet
  },
  {
    title: 'Quản lý thực đơn',
    path: ROUTE.ADMIN_MENU_MANAGEMENT,
    icon: ClipboardList
  },
  {
    title: 'Quản lý món',
    path: ROUTE.STAFF_DISH_MANAGEMENT,
    icon: CookingPot
  }
]

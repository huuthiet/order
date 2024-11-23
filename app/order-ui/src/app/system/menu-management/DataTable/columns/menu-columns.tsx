import { NavLink } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, SquareMousePointer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import {
  Button,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui'
import { IMenu } from '@/types'
import { ROUTE } from '@/constants'

export const useMenusColumns = (): ColumnDef<IMenu>[] => {
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation(['common'])
  return [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('menu.createdAt')} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt')
        return createdAt
          ? moment(new Date(createdAt as string)).format('HH:mm DD/MM/YYYY')
          : ''
      },
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('menu.date')} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('date')
        return createdAt
          ? moment(new Date(createdAt as string)).format('DD/MM/YYYY')
          : ''
      },
    },
    {
      accessorKey: 'menuItems',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('menu.totalItems')} />
      ),
      cell: ({ row }) => {
        const menuItems = row.getValue('menuItems') as IMenu['menuItems']
        return menuItems ? menuItems.length : 0
      },
    },
    {
      id: 'actions',
      header: tCommon('common.action'),
      cell: ({ row }) => {
        const menu = row.original
        return (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{tCommon('common.action')}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {tCommon('common.action')}
                </DropdownMenuLabel>
                <NavLink
                  to={`${ROUTE.STAFF_PRODUCT_DETAIL}/${menu.slug}`}
                  className="flex w-full items-center justify-start"
                >
                  <Button
                    variant="ghost"
                    className="flex w-full justify-start gap-1 px-2 text-sm"
                  >
                    <SquareMousePointer className="icon" />
                    {tCommon('common.viewDetail')}
                  </Button>
                </NavLink>
                {/* <UpdateProductDialog product={product} /> */}
                {/* <DeleteProductDialog product={product} /> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}

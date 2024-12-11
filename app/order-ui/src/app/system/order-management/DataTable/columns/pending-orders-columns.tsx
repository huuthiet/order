import { ColumnDef } from '@tanstack/react-table'
import { ShoppingCartIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import {
  DataTableColumnHeader,
} from '@/components/ui'
import { IOrder } from '@/types'
import OrderStatusBadge from '@/components/app/badge/order-status-badge'
// import PaymentStatusBadge from '@/components/app/badge/payment-status-badge'
// import { PaymentMethod } from '@/constants'

export const usePendingOrdersColumns = (): ColumnDef<IOrder>[] => {
  const { t } = useTranslation(['menu'])
  return [
    {
      accessorKey: 'icon',
      header: () => (
        <div title='' />
      ),
      cell: () => {
        return (
          <div className="flex items-center h-8 w-8 justify-center rounded-lg bg-primary p-2.5">
            <ShoppingCartIcon className="text-white icon" />
          </div>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('menu.createdAt')} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt')
        return (
          <span className='text-[0.5rem] text-muted-foreground'>{createdAt ? moment(createdAt).format('HH:mm DD/MM/YYYY') : ''}</span>
        )
      },
    },
    {
      accessorKey: 'owner',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('order.customerName')} />
      ),
      cell: ({ row }) => {
        const owner = row.original.owner.firstName + ' ' + row.original.owner.lastName
        const orderItemCount = row.original.orderItems.length
        return (
          <div className='flex flex-col justify-start gap-1'>
            <span className='text-xs font-medium'>{owner}</span>
            <div className='flex flex-row gap-1 text-xs text-muted-foreground/50'>
              <span>{orderItemCount}</span>
              {t('order.item').toLocaleLowerCase()}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('order.status')} />
      ),
      cell: ({ row }) => {
        const order = row.original
        return (
          <OrderStatusBadge
            status={order?.status}
          />

        )
      },
    },
    // {
    //   accessorKey: 'paymentMethod',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t('order.paymentMethod')} />
    //   ),
    //   cell: ({ row }) => {
    //     const order = row.original
    //     return (

    //       <div className='flex flex-col'>
    //         <span className='text-xs'>
    //           {order?.payment && order?.payment.paymentMethod === PaymentMethod.CASH ? t('order.cash') : t('order.bankTransfer')}
    //         </span>
    //         <PaymentStatusBadge
    //           status={order?.invoice?.status}
    //         />
    //       </div>
    //     )
    //   },
    // },
  ]
}

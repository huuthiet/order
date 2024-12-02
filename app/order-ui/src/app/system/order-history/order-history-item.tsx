import moment from 'moment'
import { Clock, ShoppingCartIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IOrder } from '@/types'
import { Button } from '@/components/ui'
import OrderStatusBadge from '@/components/app/badge/order-status-badge'
import { NavLink } from 'react-router-dom'
import { ROUTE } from '@/constants'
import { useCreateOrderInvoice, useExportOrderInvoice } from '@/hooks'
import { showToast } from '@/utils'

interface OrderItemDetailProps {
  order: IOrder
}

export default function OrderItemDetail({ order }: OrderItemDetailProps) {
  const { t } = useTranslation(['menu'])
  const { mutate: createOrderInvoice } = useCreateOrderInvoice()
  const { mutate: exportInvoice } = useExportOrderInvoice()

  const handleCreateOrderInvoice = () => {
    createOrderInvoice(order.slug, {
      onSuccess: () => {
        showToast('Create order invoice successfully')
        // After creating invoice, export it
        handleExportInvoice()
      },
      onError: (error) => {
        console.log('Create order invoice error', error)
      }
    })
  }

  const handleExportInvoice = () => {
    exportInvoice(order.slug, {
      onError: (error) => {
        console.log('Export invoice error', error)
      }
    })
  }

  return (
    <div
      key={order.slug}
      className="grid grid-cols-5 gap-4 px-2 py-4 border-b cursor-pointer"
    >
      <div className="justify-start col-span-1">
        <div className="flex items-center gap-2">
          <div className='flex items-center justify-center p-2 w-9 h-9 rounded-xl bg-primary/10'>
            <ShoppingCartIcon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-muted-foreground">
              {order.owner?.firstName} {order.owner?.lastName}
            </span>
            <span className="text-xs text-muted-foreground">{order.tableName}</span>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">
            {order.orderItems?.length} {t('order.item')}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {order.subtotal?.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>
      <div className="flex items-center col-span-1">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {moment(order.createdAt).format('HH:mm DD/MM/YYYY')}
          </span>
        </div>
      </div>
      <div className="col-span-1">
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="flex justify-end col-span-1 gap-2">
        <Button onClick={handleCreateOrderInvoice} variant="outline" className='text-xs border-primary text-primary hover:text-primary hover:bg-primary/10'>
          {t('order.createInvoice')}
        </Button>
        <NavLink to={`${ROUTE.STAFF_ORDER_HISTORY}/${order.slug}`}>
          <Button variant="outline" className='text-xs border-primary text-primary hover:text-primary hover:bg-primary/10'>
            {t('order.viewDetail')}
          </Button>
        </NavLink>
        {/* {order} */}
      </div>
    </div>
  )
}

import { AxiosError, isAxiosError } from 'axios'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import { Clock, ShoppingCartIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IApiResponse, IOrder } from '@/types'
import { Button } from '@/components/ui'
import OrderStatusBadge from '@/components/app/badge/order-status-badge'
import { ROUTE } from '@/constants'
import { useExportOrderInvoice } from '@/hooks'
import { showErrorToast, showToast } from '@/utils'

interface OrderItemDetailProps {
  order: IOrder
}

export default function OrderItemDetail({ order }: OrderItemDetailProps) {
  const { t } = useTranslation(['menu'])
  const { mutate: exportInvoice } = useExportOrderInvoice()

  const handleExportInvoice = () => {
    exportInvoice(order.slug, {
      onSuccess: () => {
        showToast(t('toast.exportInvoiceSuccess'))
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          const axiosError = error as AxiosError<IApiResponse<void>>
          if (axiosError.response?.data.code)
            showErrorToast(axiosError.response.data.code)
        }
      },
    })
  }

  return (
    <div
      key={order.slug}
      className="grid cursor-pointer grid-cols-5 gap-4 border-b px-2 py-4"
    >
      <div className="col-span-1 justify-start">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 p-2">
            <ShoppingCartIcon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-muted-foreground">
              {order.owner?.firstName} {order.owner?.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {order.table.name}
            </span>
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
      <div className="col-span-1 flex items-center">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {moment(order.createdAt).format('HH:mm DD/MM/YYYY')}
          </span>
        </div>
      </div>
      <div className="col-span-1">
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="col-span-1 flex justify-end gap-2">
        <NavLink to={`${ROUTE.STAFF_ORDER_HISTORY}/${order.slug}`}>
          <Button
            variant="outline"
            className="border-primary text-xs text-primary hover:bg-primary/10 hover:text-primary"
          >
            {t('order.viewDetail')}
          </Button>
        </NavLink>
        {/* Export invoice */}
        <Button
          onClick={handleExportInvoice}
          variant="outline"
          className="border-primary text-xs text-primary hover:bg-primary/10 hover:text-primary"
        >
          {t('order.exportInvoice')}
        </Button>
      </div>
    </div>
  )
}

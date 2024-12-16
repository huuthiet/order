import { useTranslation } from 'react-i18next'

import { OrderStatus } from '@/types'

interface IOrderStatusBadgeProps {
  status: OrderStatus
}

export default function OrderStatusBadge({ status }: IOrderStatusBadgeProps) {
  const { t } = useTranslation(['menu'])

  const getBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-500 bg-yellow-50 border text-white'
      case OrderStatus.SHIPPING:
        return 'bg-blue-500 bg-blue-50 border text-white '
      case OrderStatus.COMPLETED:
        return 'bg-green-500 bg-green-50 border text-white '
      case OrderStatus.PAID:
        return 'bg-green-500 bg-green-50 border text-white'
      case OrderStatus.FAILED:
        return 'bg-destructive bg-destructive/20 text-white'
    }
  }

  const getBadgeText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return t('order.pending')
      case OrderStatus.SHIPPING:
        return t('order.shipping')
      case OrderStatus.COMPLETED:
        return t('order.completed')
      case OrderStatus.PAID:
        return t('order.paid')
      case OrderStatus.FAILED:
        return t('order.failed')
    }
  }
  // Ensure the component returns valid JSX
  return (
    <span
      className={`inline-block min-w-[4.5rem] px-3 py-0.5 text-center font-beVietNam text-[0.8rem] ${getBadgeColor(
        status,
      )} rounded-full`}
    >
      {getBadgeText(status)}
    </span>
  )
}

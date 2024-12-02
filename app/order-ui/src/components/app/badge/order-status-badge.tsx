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
        return 'border-yellow-500 bg-yellow-50 border text-yellow-500 font-semibold'
      case OrderStatus.COMPLETED:
        return 'border-green-500 bg-green-50 border text-green-500 font-semibold'
      case OrderStatus.FAILED:
        return 'border-destructive bg-destructive/20 border text-destructive'
    }
  }

  const getBadgeText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return t('order.pending')
      case OrderStatus.COMPLETED:
        return t('order.completed')
      case OrderStatus.FAILED:
        return t('order.failed')
    }
  }
  // Ensure the component returns valid JSX
  return (
    <span
      className={`inline-block min-w-[4.5rem] px-4 py-1 text-center font-beVietNam text-[0.5rem] ${getBadgeColor(
        status,
      )} rounded-full`}
    >
      {getBadgeText(status)}
    </span>
  )
}

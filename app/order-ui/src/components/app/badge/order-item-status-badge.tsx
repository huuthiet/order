import { useTranslation } from 'react-i18next'

import { OrderStatus } from '@/types'

interface IOrderItemStatusBadgeProps {
  status: OrderStatus
}

export default function OrderItemStatusBadge({
  status,
}: IOrderItemStatusBadgeProps) {
  const { t } = useTranslation(['menu'])

  const getBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'border-yellow-500 bg-yellow-50 border text-yellow-500 font-semibold'
      case OrderStatus.COMPLETED:
        return 'border-green-500 bg-green-50 border text-green-500 font-semibold'
      case OrderStatus.RUNNING:
        return 'border-primary bg-primary/20 border text-primary'
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
      className={`inline-block w-fit px-4 py-1 text-center font-beVietNam text-[0.5rem] ${getBadgeColor(
        status,
      )} rounded-full`}
    >
      {getBadgeText(status)}
    </span>
  )
}

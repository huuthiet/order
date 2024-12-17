import { useTranslation } from 'react-i18next'

import { OrderStatus } from '@/types'

interface IPaymentStatusBadgeProps {
    status: OrderStatus
}

export default function PaymentStatusBadge({ status }: IPaymentStatusBadgeProps) {
    const { t } = useTranslation(['menu'])

    const getBadgeColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'bg-yellow-500 text-white'
            case OrderStatus.COMPLETED:
                return 'bg-green-500 text-white'
            case OrderStatus.SHIPPING:
                return 'bg-blue-500 text-white'
            case OrderStatus.PAID:
                return 'bg-green-500 text-white'
            case OrderStatus.FAILED:
                return 'bg-destructive text-white'
        }
    }

    const getBadgeText = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return t('paymentMethod.pending')
            case OrderStatus.COMPLETED:
                return t('paymentMethod.completed')
            case OrderStatus.SHIPPING:
                return t('paymentMethod.shipping')
            case OrderStatus.PAID:
                return t('paymentMethod.paid')
            case OrderStatus.FAILED:
                return t('paymentMethod.failed')
        }
    }
    // Ensure the component returns valid JSX
    return (
        <span
            className={`inline-block  px-2 py-1 rounded-full w-fit text-center text-xs ${getBadgeColor(
                status || OrderStatus.PENDING
            )}`}
        >
            {getBadgeText(status || OrderStatus.PENDING)}
        </span>
    )
}

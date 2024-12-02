import { useTranslation } from 'react-i18next'

import { paymentStatus } from '@/constants'

interface IPaymentStatusBadgeProps {
    status?: paymentStatus
}

export default function OrderStatusBadge({ status }: IPaymentStatusBadgeProps) {
    const { t } = useTranslation(['menu'])

    const getBadgeColor = (status: paymentStatus) => {
        switch (status) {
            case paymentStatus.PENDING:
                return 'border-yellow-500 bg-yellow-50 border text-yellow-500 font-semibold'
            case paymentStatus.PAID:
                return 'border-green-500 bg-green-50 border text-green-500 font-semibold'
            case paymentStatus.CANCELLED:
                return 'border-destructive bg-destructive/20 border text-destructive'
        }
    }

    const getBadgeText = (status: paymentStatus) => {
        switch (status) {
            case paymentStatus.PENDING:
                return t('paymentMethod.pending')
            case paymentStatus.PAID:
                return t('paymentMethod.paid')
            case paymentStatus.CANCELLED:
                return t('paymentMethod.failed')
        }
    }
    // Ensure the component returns valid JSX
    return (
        <span
            className={`inline-block min-w-[4.5rem] px-4 py-1 text-center font-beVietNam text-[0.5rem] ${getBadgeColor(
                status || paymentStatus.PENDING
            )} rounded-full`}
        >
            {getBadgeText(status || paymentStatus.PENDING)}
        </span>
    )
}

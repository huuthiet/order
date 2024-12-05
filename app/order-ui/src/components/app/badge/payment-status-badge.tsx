import { useTranslation } from 'react-i18next'

import { paymentStatus } from '@/constants'

interface IPaymentStatusBadgeProps {
    status?: paymentStatus
}

export default function PaymentStatusBadge({ status }: IPaymentStatusBadgeProps) {
    const { t } = useTranslation(['menu'])

    const getBadgeColor = (status: paymentStatus) => {
        switch (status) {
            case paymentStatus.PENDING:
                return 'text-yellow-500 italic'
            case paymentStatus.PAID:
                return 'text-green-500 italic'
            case paymentStatus.CANCELLED:
                return 'text-destructive italic'
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
            className={`inline-block w-fit text-center text-[0.5rem] ${getBadgeColor(
                status || paymentStatus.PENDING
            )}`}
        >
            {getBadgeText(status || paymentStatus.PENDING)}
        </span>
    )
}

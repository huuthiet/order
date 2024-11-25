import { CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PaymentMethodRadioGroup } from '@/components/app/radio'
import { Label } from '@/components/ui'

interface PaymentMethodSelectProps {
  onSubmit?: (paymentMethod: string) => void
}

export default function PaymentMethodSelect({
  onSubmit,
}: PaymentMethodSelectProps) {
  const { t } = useTranslation('menu')

  const handlePaymentMethodSubmit = (paymentMethod: string) => {
    if (onSubmit) {
      onSubmit(paymentMethod)
    }
  }

  return (
    <div className="mt-6 flex w-full flex-col gap-2 rounded-md border">
      <div className="bg-muted/60 p-4">
        <Label className="text-md">{t('paymentMethod.title')}</Label>
      </div>
      <div className="p-4">
        <PaymentMethodRadioGroup onSubmit={handlePaymentMethodSubmit} />
      </div>
      <div className="flex items-center gap-1 px-4 pb-4 text-[0.5rem] text-muted-foreground">
        <CircleAlert size={12} className="text-blue-500" />
        {t('paymentMethod.bankTransferProcessing')}
      </div>
    </div>
  )
}

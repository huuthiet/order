import { CircleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PaymentMethodRadioGroup } from '@/components/app/radio'
import { Label } from '@/components/ui'

export default function PaymentMethodSelect() {
  const { t } = useTranslation('menu')

  return (
    <div className="flex flex-col w-full gap-2 mt-6 border rounded-md">
      <div className="p-4 bg-muted/60">
        <Label className="text-md">{t('paymentMethod.title')}</Label>
      </div>
      <div className="p-4">
        <PaymentMethodRadioGroup />
      </div>
      <div className="px-4 pb-4 text-[0.5rem] flex gap-1 items-center text-muted-foreground">
        <CircleAlert size={12} className="text-blue-500" />
        {t('paymentMethod.bankTransferProcessing')}
      </div>
    </div>
  )
}

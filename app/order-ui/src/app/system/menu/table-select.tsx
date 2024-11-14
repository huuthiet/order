import { Label } from '@/components/ui'
import { useTranslation } from 'react-i18next'

export default function TableSelect() {
  const { t } = useTranslation('menu')

  return (
    <div className="flex flex-col w-full gap-2 mt-6 border rounded-md">
      <div className="p-4 bg-muted/60">
        <Label className="text-md">{t('table.title')}</Label>
      </div>
      <div className="p-4">{/* <PaymentMethodRadioGroup /> */}</div>
    </div>
  )
}

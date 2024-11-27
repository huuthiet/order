import { Coins, CreditCard, WalletMinimal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { RadioGroup, RadioGroupItem, Label } from '@/components/ui'

interface PaymentMethodRadioGroupProps {
  onSubmit?: (paymentMethod: string) => void
}

export default function PaymentMethodRadioGroup({
  onSubmit,
}: PaymentMethodRadioGroupProps) {
  const { t } = useTranslation('menu')

  const handlePaymentMethodChange = (paymentMethod: string) => {
    if (onSubmit) {
      onSubmit(paymentMethod)
    }
  }
  return (
    <RadioGroup
      defaultValue="internalWallet"
      className="gap-6"
      onValueChange={handlePaymentMethodChange}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="internalWallet" id="r1" />
        <div className="flex items-center gap-1 pl-2 text-muted-foreground">
          <WalletMinimal size={20} />
          <Label htmlFor="r1">{t('paymentMethod.internalWallet')}</Label>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="bank-transfer" id="r2" />
        <div className="flex items-center gap-1 pl-2 text-muted-foreground">
          <CreditCard size={20} />
          <Label htmlFor="r2">{t('paymentMethod.bankTransfer')}</Label>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="cash" id="r3" />
        <div className="flex items-center gap-1 pl-2 text-muted-foreground">
          <Coins size={20} />
          <Label htmlFor="r3">{t('paymentMethod.cash')}</Label>
        </div>
      </div>
    </RadioGroup>
  )
}

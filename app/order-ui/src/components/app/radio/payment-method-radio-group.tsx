import { Coins, CreditCard, WalletMinimal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCartItemStore } from '@/stores'

export default function PaymentMethodRadioGroup() {
  const { t } = useTranslation('menu')
  const { addPaymentMethod } = useCartItemStore()

  const handlePaymentMethodChange = (paymentMethod: string) => {
    addPaymentMethod(paymentMethod)
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
        <RadioGroupItem value="bankTransfer" id="r2" />
        <div className="flex items-center gap-1 pl-2 text-muted-foreground">
          <CreditCard size={20} />
          <Label htmlFor="r1">{t('paymentMethod.bankTransfer')}</Label>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="cash" id="r3" />
        <div className="flex items-center gap-1 pl-2 text-muted-foreground">
          <Coins size={20} />
          <Label htmlFor="r1">{t('paymentMethod.cash')}</Label>
        </div>
      </div>
    </RadioGroup>
  )
}

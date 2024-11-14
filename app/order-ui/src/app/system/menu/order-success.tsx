import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { OrderSuccess } from '@/assets/images'
import { Button } from '@/components/ui'
import { ROUTE } from '@/constants'

export default function OrderSuccessPage() {
  const { t } = useTranslation('menu')
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-200px)] gap-2">
      <img src={OrderSuccess} className="w-48 h-48 sm:object-fill" />
      <div>{t('order.orderSuccess')}</div>
      <div className="flex gap-2">
        <Button variant="outline">{t('order.viewDetail')}</Button>
        <Button onClick={() => navigate(ROUTE.STAFF_MENU)}>{t('order.backToMenu')}</Button>
      </div>
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { OrderSuccess } from '@/assets/images'
import { Button } from '@/components/ui'
import { ROUTE } from '@/constants'

export default function OrderSuccessPage() {
  const { t } = useTranslation('menu')
  const { slug } = useParams()
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-200px)] gap-4">
      <img src={OrderSuccess} className="w-48 h-48 sm:object-fill" />
      <div className='text-xl font-semibold text-primary'>{t('order.orderSuccess')}</div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(`${ROUTE.STAFF_ORDER_HISTORY}/${slug}`)}>{t('order.viewDetail')}</Button>
        <Button onClick={() => navigate(ROUTE.STAFF_MENU)}>{t('order.backToMenu')}</Button>
      </div>
    </div>
  )
}

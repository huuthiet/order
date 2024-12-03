import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AlarmClock } from 'lucide-react'

import { useOrders, usePagination } from '@/hooks'
import { useUserStore } from '@/stores'
import { OrderStatus } from '@/types'

export default function OrderWaitListCounting() {
  const { t } = useTranslation(['menu'])
  const { userInfo } = useUserStore()
  const { pagination } = usePagination()

  const { data, refetch } = useOrders({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    ownerSlug: userInfo?.slug,
    order: 'DESC',
    branchSlug: userInfo?.branch.slug,
    status: OrderStatus.PENDING,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5000)
    return () => clearInterval(interval)
  }, [refetch])

  return (
    <div className="flex h-[8rem] min-w-[12rem] flex-col justify-between rounded-md border p-6 text-muted-foreground">
      <div className="flex flex-row items-center justify-between text-md">
        {t('order.pendingOrders')}
        <div className="flex items-center justify-center p-3 bg-green-100 rounded-lg h-fit w-fit">
          <AlarmClock className="text-green-500 icon" />
        </div>
      </div>
      <span className="flex items-center h-full text-3xl">{data?.result.total}</span>
    </div>
  )
}

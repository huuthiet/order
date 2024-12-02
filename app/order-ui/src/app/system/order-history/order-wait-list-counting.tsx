import { useOrders, usePagination } from '@/hooks'
import { useUserStore } from '@/stores'
import { IOrder, OrderStatus } from '@/types'
import { AlarmClock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function OrderWaitListCounting() {
  const { t } = useTranslation(['menu'])
  const { userInfo } = useUserStore()
  const { pagination } = usePagination()

  const { data } = useOrders({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    ownerSlug: userInfo?.slug,
    order: 'DESC',
    branchSlug: userInfo?.branch.slug,
  })

  const orders = data?.result.items || []
  const countPendingOrders = (orders: IOrder[]): number => {
    return orders.filter((order) => order.status === OrderStatus.PENDING).length
  }

  const pendingCount = countPendingOrders(orders)
  return (
    <div className="flex h-[8rem] min-w-[12rem] flex-col justify-between rounded-md border p-6 text-muted-foreground">
      <div className="flex flex-row items-center justify-between text-md">
        {t('order.pendingOrders')}
        <div className="flex items-center justify-center p-3 bg-green-100 rounded-lg h-fit w-fit">
          <AlarmClock className="text-green-500 icon" />
        </div>
      </div>
      <span className="flex items-center h-full text-3xl">{pendingCount}</span>
    </div>
  )
}

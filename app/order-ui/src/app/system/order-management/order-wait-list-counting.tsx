import { useOrders } from '@/hooks'
import { useUserStore } from '@/stores'
import { IOrder, OrderStatus } from '@/types'
import { AlarmClock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function OrderWaitListCounting() {
  const { t } = useTranslation(['menu'])
  const { userInfo } = useUserStore()
  const { data } = useOrders({
    ownerSlug: '',
    branchSlug: userInfo?.branch.slug,
  })

  const orders = data?.result || []
  const countPendingOrders = (orders: IOrder[]): number => {
    return orders.filter((order) => order.status === OrderStatus.PENDING).length
  }

  const pendingCount = countPendingOrders(orders)
  return (
    <div className="flex h-[8rem] min-w-[12rem] flex-col justify-between rounded-md border p-6 text-muted-foreground">
      <div className="text-md flex flex-row items-center justify-between">
        {t('order.pendingOrders')}
        <div className="flex h-fit w-fit items-center justify-center rounded-lg bg-green-100 p-3">
          <AlarmClock className="icon text-green-500" />
        </div>
      </div>
      <span className="flex h-full items-center text-3xl">{pendingCount}</span>
    </div>
  )
}

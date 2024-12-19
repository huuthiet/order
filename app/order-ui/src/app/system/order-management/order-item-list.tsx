import { useTranslation } from 'react-i18next'

import { IOrder } from '@/types'
import OrderItemDetail from './order-item-detail'
import { ScrollArea } from '@/components/ui'

interface IOrderItemListProps {
  orderDetailData?: IOrder
}

export default function OrderItemList({
  orderDetailData,
}: IOrderItemListProps) {
  const { t } = useTranslation(['menu'])
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center justify-between py-1 font-semibold text-md">
        {t('order.orderDetail')}
      </span>

      <div className="flex flex-col w-full">
        <ScrollArea className="">
          {orderDetailData?.orderItems?.map((item) => (
            <div key={item.slug} className="grid items-center w-full gap-4">
              <OrderItemDetail order={item} />
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

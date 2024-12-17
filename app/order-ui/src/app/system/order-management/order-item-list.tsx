import { useTranslation } from 'react-i18next'

import { IOrder } from '@/types'
import OrderItemDetail from './order-item-detail'
// import { publicFileURL } from '@/constants'
import { ScrollArea } from '@/components/ui'
// import {
//   CreateOrderTrackingByStaffDialog,
//   CreateOrderTrackingByRobotDialog,
// } from '@/components/app/dialog'
// import { useOrderTrackingStore } from '@/stores'

interface IOrderItemListProps {
  orderDetailData?: IOrder
}

export default function OrderItemList({
  orderDetailData,
}: IOrderItemListProps) {
  console.log('check orderDetailData', orderDetailData)
  const { t } = useTranslation(['menu'])
  // const { getSelectedItems } = useOrderTrackingStore()
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center justify-between py-1 font-semibold text-md">
        {t('order.orderDetail')}
        {/* {getSelectedItems().length > 0 && (
          <div className="flex gap-2">
            <CreateOrderTrackingByStaffDialog />
            <CreateOrderTrackingByRobotDialog />
          </div>
        )} */}
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

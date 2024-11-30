import { useTranslation } from 'react-i18next'

import { IOrder } from '@/types'
import OrderItemDetail from './order-item-detail'
import { publicFileURL } from '@/constants'
import { ScrollArea } from '@/components/ui'

interface IOrderItemListProps {
  orderDetailData: IOrder
}

export default function OrderItemList({
  orderDetailData,
}: IOrderItemListProps) {
  const { t } = useTranslation(['menu'])
  return (
    <div className="flex flex-col gap-1">
      <span className="px-4 py-1 text-lg font-medium">
        {t('order.orderDetail')}
      </span>
      <div className="flex w-full flex-col gap-2">
        <ScrollArea className="h-[24rem] px-4">
          {orderDetailData?.orderItems?.map((item) => (
            <div
              key={item.slug}
              className="grid w-full items-center gap-4 border-b-2 py-4"
            >
              <div
                key={`${item.slug}`}
                className="grid w-full grid-cols-4 flex-row items-center"
              >
                <div className="col-span-2 flex w-full justify-start">
                  <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
                    <div className="relative">
                      <img
                        src={`${publicFileURL}/${item.variant.product.image}`}
                        alt={item.variant.product.name}
                        className="h-12 w-20 rounded-lg object-cover sm:h-16 sm:w-24"
                      />
                      <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white">
                        x{item.quantity}
                      </span>
                    </div>

                    <div className="flex h-full flex-col items-start">
                      <span className="truncate font-bold">
                        {item.variant.product.name}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {`${(item.variant.price || 0).toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex justify-end">
                  <span className="text-sm font-semibold text-primary">
                    {`${((item.variant.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
              </div>
              {/* <div className="flex items-center gap-2">
                                <NotepadText
                                  size={24}
                                  className="text-muted-foreground"
                                />
                                <Input value={item.note} readOnly />
                              </div> */}
              <OrderItemDetail order={item} />
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

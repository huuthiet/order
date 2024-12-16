import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// import { ChevronDown, ChevronUp } from 'lucide-react'
import { CheckedState } from '@radix-ui/react-checkbox'

import { IOrderDetail, OrderItemStatus } from '@/types'
import { Checkbox } from '@/components/ui'
import { useOrderTrackingStore } from '@/stores'
import OrderItemStatusBadge from '@/components/app/badge/order-item-status-badge'

interface OrderItemDetailProps {
  order: IOrderDetail
}

export default function OrderItemDetail({ order }: OrderItemDetailProps) {
  const { t } = useTranslation(['menu'])
  const { addSelectedItem, removeSelectedItem, getSelectedItems } =
    useOrderTrackingStore()
  const [selectedIndexes, setSelectedIndexes] = useState<{
    [key: string]: boolean
  }>({})

  useEffect(() => {
    const selectedItems = getSelectedItems()
    const newSelectedIndexes: { [key: string]: boolean } = {}

    selectedItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const key = `${item.slug}-${i}`
        newSelectedIndexes[key] = false
      }
    })
    setSelectedIndexes(newSelectedIndexes)
  }, [getSelectedItems])

  const handleSelectOrderItem = (
    checked: CheckedState,
    orderItem: IOrderDetail,
    itemIndex: number,
  ) => {
    const key = `${orderItem.slug}-${itemIndex}`

    if (checked === true) {
      setSelectedIndexes((prev) => ({ ...prev, [key]: true }))
      const singleItem: IOrderDetail = {
        ...orderItem,
        quantity: 1,
        subtotal: orderItem.variant.price,
        slug: orderItem.slug,
        index: itemIndex,
      }
      addSelectedItem(singleItem)
    } else {
      setSelectedIndexes((prev) => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })
      removeSelectedItem(`${orderItem.slug}-${itemIndex}`)
    }
  }

  const isChecked = (orderItem: IOrderDetail, index: number) => {
    const key = `${orderItem.slug}-${index}`
    return !!selectedIndexes[key]
  }

  const renderOrderItem = (orderItem: IOrderDetail) => {
    const totalProcessedItems =
      orderItem.status.COMPLETED

    // console.log('item', orderItem)

    const items = Array(orderItem.quantity)
      .fill(null)
      .map((_, index) => {
        const latestTrackingItem = orderItem.trackingOrderItems[0]?.tracking?.status

        if (latestTrackingItem === 'FAILED') {
          return { status: OrderItemStatus.FAILED, index }
        }
        if (latestTrackingItem === 'RUNNING') {
          return { status: OrderItemStatus.RUNNING, index }
        }

        // if (index < orderItem.status.COMPLETED) {
        //   return { status: OrderStatus.COMPLETED, index }
        // }
        // if (index < orderItem.status.COMPLETED + orderItem.status.RUNNING) {
        //   return { status: OrderStatus.SHIPPING, index }
        // }
        return { status: OrderItemStatus.PENDING, index }
      })

    console.log('items', items)

    return (
      <div key={orderItem.id} className="mt-4 space-y-2">
        <div className="font-medium">
          {orderItem.variant.product.name}{' '}
          {orderItem.note && `(${orderItem.note})`}
          <span className="ml-2 text-sm text-gray-500">
            ({totalProcessedItems}/{orderItem.quantity})
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.index}
              className="grid flex-row items-center grid-cols-5 gap-3 px-2 py-4 border rounded-md"
            >
              {item.status === OrderItemStatus.PENDING ||
                item.status === OrderItemStatus.FAILED ? (
                <div className="flex flex-row items-center col-span-3 gap-2">
                  <Checkbox
                    className="w-5 h-5 shadow-none"
                    checked={isChecked(orderItem, item.index)}
                    onCheckedChange={(checked) =>
                      handleSelectOrderItem(checked, orderItem, item.index)
                    }
                  />
                  <p className="text-sm">{orderItem.variant.product.name}</p>
                  <p className="text-sm">
                    {t('order.size')}
                    {orderItem.variant.size?.name.toUpperCase()}
                  </p>
                </div>
              ) : (
                <div className="flex flex-row items-center justify-start col-span-3 gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${item.status === OrderItemStatus.COMPLETED
                      ? 'bg-green-500'
                      : item.status === OrderItemStatus.RUNNING
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                      }`}
                  />
                  <p className="text-sm">{orderItem.variant.product.name}</p>
                  {'-'}
                  <p className="text-sm">
                    {t('order.size')}
                    {orderItem.variant.size?.name.toUpperCase()}
                  </p>
                </div>
              )}

              <div className="col-span-1 text-sm text-center">
                {orderItem.variant.price.toLocaleString()}đ
              </div>
              <div className="flex justify-end col-span-1">
                <OrderItemStatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  useEffect(() => {
    order.trackingOrderItems.forEach((trackingItem, index) => {
      if (trackingItem.tracking.status === 'FAILED') {
        setSelectedIndexes((prev) => {
          const updated = { ...prev }
          delete updated[`${order.slug}-${index}`]
          return updated
        })
      }
    })
  }, [order])

  return (
    <div className="flex flex-col w-full gap-2 rounded-lg">
      <div className="flex flex-col gap-2">{renderOrderItem(order)}</div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckedState } from '@radix-ui/react-checkbox'

import { ChefOrderItemStatus, IOrderDetail, OrderItemStatus } from '@/types'
import { Badge, Checkbox } from '@/components/ui'
import { useOrderTrackingStore } from '@/stores'
import OrderItemStatusBadge from '@/components/app/badge/order-item-status-badge'
import { formatCurrency } from '@/utils'

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
        subtotal: orderItem.promotion && orderItem.promotion.value ? orderItem.variant.price * (1 - orderItem.promotion.value / 100) : orderItem.variant.price,
        slug: orderItem.slug,
        index: itemIndex,
        id: orderItem.id!,
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

  const originalPrice = order.variant.price

  const priceAfterDiscount = order.promotion && order.promotion.value
    ? order.variant.price * (1 - order.promotion.value / 100)
    : order.variant.price

  const renderOrderItem = (orderItem: IOrderDetail) => {
    const items = Array(orderItem.quantity)
      .fill(null)
      .map((_, index) => {
        if (index < orderItem.status.COMPLETED) {
          return { status: OrderItemStatus.COMPLETED, index }
        }
        if (index < orderItem.status.COMPLETED + orderItem.status.RUNNING) {
          return { status: OrderItemStatus.RUNNING, index }
        }
        if (index < orderItem.status.COMPLETED + orderItem.status.RUNNING + orderItem.status.FAILED) {
          return { status: OrderItemStatus.FAILED, index }
        }
        return { status: OrderItemStatus.PENDING, index }
      })

    // count no completed items
    const noCompletedItems = orderItem.chefOrderItems?.filter(item => item.status === ChefOrderItemStatus.PENDING).length

    // count cooking items
    const cookingItems = orderItem.chefOrderItems?.filter(item => item.status === ChefOrderItemStatus.IN_PROGRESS).length

    // count cooked items
    const cookedItems = orderItem.chefOrderItems?.filter(item => item.status === ChefOrderItemStatus.COMPLETED).length



    return (
      <div key={orderItem.id} className="mt-4 space-y-2">
        <div className="flex flex-col gap-3">
          {/* Product Name */}
          <div className="flex gap-2 items-center">
            <Badge className="h-9 text-md">
              {orderItem.variant.product.name}
            </Badge>
            {/* <span className="px-2 py-1 text-sm rounded-md text-muted-foreground bg-muted-foreground/10">
              {totalProcessedItems}/{orderItem.quantity}
            </span> */}
          </div>

          {/* Order Status Overview */}
          <div className="grid grid-cols-2 gap-2 w-full md:grid-cols-4">
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-md">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              <span className="text-sm font-medium text-primary">
                {t('order.noCooked')}: {noCompletedItems}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-md">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">
                {t('order.cooking')}: {cookingItems}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-md">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                {t('order.cooked')}: {cookedItems}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-purple-100 px-3 py-1.5 rounded-md">
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-purple-700">
                {t('order.delivered')}: {orderItem.trackingOrderItems.length > 0 ? orderItem.trackingOrderItems.filter(item => item.tracking.status === 'COMPLETED').length : 0}
              </span>
            </div>
          </div>

          {/* Order Note */}
          <div className="w-full">
            {orderItem.note ? (
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold whitespace-nowrap text-muted-foreground">
                  {t('order.note')}:
                </span>
                <div className="flex-1 px-3 py-1.5 text-sm font-medium border rounded-md bg-gray-50 border-muted-foreground/30 text-muted-foreground">
                  {orderItem.note}
                </div>
              </div>
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">
                {t('order.noNote')}
              </span>
            )}
          </div>
        </div>


        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.index}
              className="grid flex-row grid-cols-9 gap-3 items-center py-4 rounded-md"
            >
              {item.status === OrderItemStatus.PENDING ||
                item.status === OrderItemStatus.FAILED ? (
                <div className="flex flex-row col-span-4 gap-2 items-center">
                  <Checkbox
                    className="w-5 h-5 shadow-none"
                    checked={isChecked(orderItem, item.index)}
                    onCheckedChange={(checked) =>
                      handleSelectOrderItem(checked, orderItem, item.index)
                    }
                  />
                  <p className="text-xs sm:text-sm">{orderItem.variant.product.name}</p>
                  <p className="text-xs sm:text-sm">
                    {t('order.size')}
                    {orderItem.variant.size?.name.toUpperCase()}
                  </p>
                </div>
              ) : (
                <div className="flex flex-row col-span-4 gap-3 justify-start items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${item.status === OrderItemStatus.COMPLETED
                      ? 'bg-green-500'
                      : item.status === OrderItemStatus.RUNNING
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                      }`}
                  />
                  <p className="text-xs sm:text-sm">{orderItem.variant.product.name}</p>
                  {'-'}
                  <p className="text-xs sm:text-sm">
                    {t('order.size')}
                    {orderItem.variant.size?.name.toUpperCase()}
                  </p>
                </div>
              )}

              {orderItem.promotion && orderItem.promotion.value > 0 ? (
                <div className="flex col-span-2 gap-3 items-center text-xs text-center sm:text-sm">
                  <span className='text-xs line-through text-muted-foreground'>
                    {formatCurrency(originalPrice)}
                  </span>
                  <span className='text-primary text-extrabold'>
                    {formatCurrency(priceAfterDiscount)}
                  </span>
                </div>
              ) : (
                <div className="flex col-span-2 gap-3 items-center text-xs text-center sm:text-sm">
                  <span className="text-muted-foreground text-extrabold">
                    {formatCurrency(originalPrice)}
                  </span>
                </div>
              )}
              <div className="flex col-span-3 justify-end">
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
    <div className="flex flex-col gap-2 w-full rounded-lg">
      <div className="flex flex-col gap-2">{renderOrderItem(order)}</div>
    </div>
  )
}

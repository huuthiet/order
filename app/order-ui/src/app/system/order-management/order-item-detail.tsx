import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CheckedState } from '@radix-ui/react-checkbox'

import { IOrderDetail } from '@/types'
import { Button, Checkbox } from '@/components/ui'
import { useOrderTrackingStore } from '@/stores'

interface OrderItemDetailProps {
  order: IOrderDetail
}

export default function OrderItemDetail({ order }: OrderItemDetailProps) {
  const [showDetails, setShowDetails] = useState(false)
  const { addSelectedItem, removeSelectedItem, isItemSelected } =
    useOrderTrackingStore()
  const [selectedIndexes, setSelectedIndexes] = useState<{
    [key: string]: boolean
  }>({})

  console.log(order.variant.product.name)

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
      }
      addSelectedItem(singleItem)
    } else {
      setSelectedIndexes((prev) => ({ ...prev, [key]: false }))
      removeSelectedItem(`${orderItem.slug}-${itemIndex}`)
    }
  }

  const isChecked = (orderItem: IOrderDetail, index: number) => {
    const key = `${orderItem.slug}-${index}`
    return selectedIndexes[key] || isItemSelected(orderItem.slug, index)
  }

  const renderOrderItem = (orderItem: IOrderDetail) => {
    const totalProcessedItems =
      orderItem.status.running + orderItem.status.completed

    const items = Array(orderItem.quantity)
      .fill(null)
      .map((_, index) => {
        if (index < orderItem.status.completed) {
          return { status: 'completed', index }
        }
        if (index < orderItem.status.completed + orderItem.status.running) {
          return { status: 'running', index }
        }
        return { status: 'pending', index }
      })

    return (
      <div key={orderItem.id} className="space-y-2">
        <div className="font-medium">
          {orderItem.variant.product.name} ({orderItem.note.toLowerCase()})
          <span className="ml-2 text-sm text-gray-500">
            ({totalProcessedItems}/{orderItem.quantity})
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.index}
              className="grid grid-cols-3 flex-row items-center gap-3 rounded-md border px-2 py-4"
            >
              {item.status === 'pending' ? (
                <div className="col-span-1 flex flex-row items-center gap-2">
                  <Checkbox
                    checked={isChecked(orderItem, item.index)}
                    onCheckedChange={(checked) =>
                      handleSelectOrderItem(checked, orderItem, item.index)
                    }
                  />
                  <p className="text-sm">{orderItem.variant.product.name}</p>
                  <p className="text-sm">
                    {orderItem.variant.size?.name.toUpperCase()}
                  </p>
                </div>
              ) : (
                <div className="col-span-1 flex flex-row items-center justify-start gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      item.status === 'completed'
                        ? 'bg-green-500'
                        : item.status === 'running'
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                    }`}
                  />
                  <p className="text-sm">{orderItem.variant.product.name}</p>
                  <p className="text-sm">
                    {orderItem.variant.size?.name.toUpperCase()}
                  </p>
                </div>
              )}

              <div className="col-span-1 text-center text-sm">
                {orderItem.variant.price.toLocaleString()} VND
              </div>
              <p className="col-span-1 flex w-full justify-end">
                <span className="rounded-full border border-muted-foreground/40 px-2 py-0.5 text-xs text-gray-500">
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg">
      <Button
        variant="outline"
        onClick={() => setShowDetails(!showDetails)}
        className="w-fit justify-between"
      >
        <span className="text-sm font-medium">Order detail</span>
        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>

      {showDetails && (
        <div className="mt-4 space-y-4">{renderOrderItem(order)}</div>
      )}
    </div>
  )
}

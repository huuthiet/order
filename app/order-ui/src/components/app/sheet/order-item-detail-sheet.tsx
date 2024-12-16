import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import {
  CustomerInformation,
  OrderItemList,
} from '@/app/system/order-management'
import { useOrderBySlug, useOrders, usePagination } from '@/hooks'
import { useOrderTrackingStore, useUserStore } from '@/stores'
import { IOrder } from '@/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  ScrollArea,
  Button,
} from '@/components/ui'
import {
  CreateOrderTrackingByStaffDialog,
  CreateOrderTrackingByRobotDialog,
} from '@/components/app/dialog'

interface IOrderItemDetailSheetProps {
  order: string
  isOpen: boolean
  onClose: () => void
}

export default function OrderItemDetailSheet({
  order,
  isOpen,
  onClose,
}: IOrderItemDetailSheetProps) {
  const { t: tCommon } = useTranslation(['common'])
  const { userInfo } = useUserStore()
  const { pagination } = usePagination()
  const [shouldFetchOrders, setShouldFetchOrders] = useState(false)
  const [orderSlugs, setOrderSlugs] = useState<string[]>([])
  const [orderDetails, setOrderDetails] = useState<IOrder[]>([])
  const [currentFetchIndex, setCurrentFetchIndex] = useState(0)

  // Log trước khi call hook useOrderBySlug cho order chính
  console.log('Main order slug before hook:', order)
  const { data: selectedOrder, refetch: refetchSelectedOrder } = useOrderBySlug(
    order,
    {
      enabled: !!order,
    },
  )

  console.log('Selected order:', selectedOrder)

  const { getSelectedItems } = useOrderTrackingStore()

  const { data: ordersInTheSameTable, refetch: allOrderRefetch } = useOrders({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ownerSlug: userInfo?.slug,
    order: 'DESC',
    branchSlug: userInfo?.branch.slug,
    table: selectedOrder?.result?.table?.slug,
    hasPaging: false,
    enabled: shouldFetchOrders && !!selectedOrder?.result?.table?.slug,
  })

  console.log('Orders in the same table:', ordersInTheSameTable)

  // Kiểm tra nếu có dữ liệu từ ordersInTheSameTable
  useEffect(() => {
    const slugs =
      ordersInTheSameTable?.result?.items?.map((item) => item.slug) || []
    setOrderSlugs(slugs)
    console.log('Order slugs:', slugs)
  }, [ordersInTheSameTable])

  // Hook để fetch từng order một
  const { data: currentOrderDetail } = useOrderBySlug(
    shouldFetchOrders && orderSlugs[currentFetchIndex]
      ? orderSlugs[currentFetchIndex]
      : '',
    {
      enabled:
        shouldFetchOrders &&
        currentFetchIndex < orderSlugs.length &&
        orderSlugs[currentFetchIndex] !== order, // Không fetch order hiện tại
    },
  )

  // Effect để xử lý kết quả fetch và chuyển sang fetch order tiếp theo
  useEffect(() => {
    if (currentOrderDetail?.result) {
      setOrderDetails((prev) => {
        const exists = prev.some(
          (detail) => detail.slug === currentOrderDetail.result.slug,
        )
        if (!exists) {
          return [...prev, currentOrderDetail.result]
        }
        return prev
      })

      setCurrentFetchIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        return nextIndex < orderSlugs.length ? nextIndex : prevIndex
      })
    }
  }, [currentOrderDetail])

  // Thêm hàm để bắt đầu fetch orders
  const handleFetchOrders = () => {
    setShouldFetchOrders(true)
    setOrderDetails([]) // Reset order details
    setCurrentFetchIndex(0) // Reset index về 0 để bắt đầu fetch từ đầu
  }

  // Thêm hàm để refresh tất cả orders
  const handleRefetchAll = async () => {
    setOrderDetails([]) // Clear current orders
    setCurrentFetchIndex(0) // Reset index
    await allOrderRefetch() // Refetch danh sách orders
  }

  // Thêm polling effect
  useEffect(() => {
    if (!shouldFetchOrders) return

    const interval = setInterval(async () => {
      try {
        // Refetch order chính
        await refetchSelectedOrder()

        // Refetch danh sách orders cùng bàn để cập nhật orderSlugs
        await allOrderRefetch()

        // Không reset lại trạng thái
        setCurrentFetchIndex(0)

        console.log('Polling: Refreshing orders...')
      } catch (error) {
        console.error('Error during polling:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [shouldFetchOrders, refetchSelectedOrder, allOrderRefetch])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between mt-6">
            Thông tin chi tiết
            <Button
              onClick={shouldFetchOrders ? handleRefetchAll : handleFetchOrders}
            >
              {shouldFetchOrders ? 'Refresh Orders' : 'Load Orders'}
            </Button>
          </SheetTitle>
          {getSelectedItems().length > 0 && (
            <div className="flex gap-2">
              <CreateOrderTrackingByStaffDialog />
              <CreateOrderTrackingByRobotDialog />
            </div>
          )}
        </SheetHeader>
        <ScrollArea className="h-[32rem] min-h-fit">
          <div className="mt-4">
            {order ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 p-4 border-2 rounded-lg border-primary bg-primary/5">
                  <div className="font-medium text-primary">Current Order</div>
                  <CustomerInformation
                    orderDetailData={selectedOrder?.result}
                  />
                  <OrderItemList orderDetailData={selectedOrder?.result} />
                </div>

                {shouldFetchOrders && (
                  <div className="flex flex-col gap-4">
                    {orderDetails
                      .filter((orderDetail) => orderDetail.slug !== order)
                      .map((orderDetail) => (
                        <div
                          key={orderDetail.slug}
                          className="flex flex-col gap-2 p-4 border rounded-lg"
                        >
                          <CustomerInformation orderDetailData={orderDetail} />
                          <OrderItemList orderDetailData={orderDetail} />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
                {tCommon('common.noData')}
              </p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

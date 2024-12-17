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
import { CircleAlert } from 'lucide-react'

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
  const { t } = useTranslation(['menu'])
  const { userInfo } = useUserStore()
  const { pagination } = usePagination()
  const [shouldFetchOrders, setShouldFetchOrders] = useState(false)
  const [orderSlugs, setOrderSlugs] = useState<string[]>([])
  const [orderDetails, setOrderDetails] = useState<IOrder[]>([])
  const [currentFetchIndex, setCurrentFetchIndex] = useState(0)
  const { getSelectedItems } = useOrderTrackingStore()

  // Polling: Order chính
  const { data: selectedOrder, refetch: refetchSelectedOrder } = useOrderBySlug(
    order,
    {
      enabled: !!order,
    },
  )

  useEffect(() => {
    if (!order) return

    const interval = setInterval(async () => {
      try {
        console.log('Polling main order...')
        await refetchSelectedOrder()
      } catch (error) {
        console.error('Error polling main order:', error)
      }
    }, 5000) // Polling mỗi 5 giây

    return () => clearInterval(interval) // Cleanup
  }, [order, refetchSelectedOrder])

  // Lấy danh sách orders cùng bàn
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

  useEffect(() => {
    const slugs =
      ordersInTheSameTable?.result?.items?.map((item) => item.slug) || []
    setOrderSlugs(slugs)
    console.log('Order slugs:', slugs)
  }, [ordersInTheSameTable])

  // Update orderDetails when ordersInTheSameTable changes
  // useEffect(() => {
  //   if (ordersInTheSameTable?.result?.items) {
  //     setOrderDetails(ordersInTheSameTable.result.items)
  //   }
  // }, [ordersInTheSameTable])

  // Fetch từng order từ danh sách orders cùng bàn
  const { data: currentOrderDetail } = useOrderBySlug(
    shouldFetchOrders && orderSlugs[currentFetchIndex]
      ? orderSlugs[currentFetchIndex]
      : '',
    {
      enabled:
        shouldFetchOrders &&
        currentFetchIndex < orderSlugs.length &&
        orderSlugs[currentFetchIndex] !== order,
    },
  )

  useEffect(() => {
    if (currentOrderDetail?.result) {
      setOrderDetails((prev) => {
        const exists = prev.some(
          (detail) => detail.slug === currentOrderDetail.result.slug,
        )
        if (!exists) {
          return [...prev, currentOrderDetail.result]
        }
        return prev.map((detail) =>
          detail.slug === currentOrderDetail.result.slug
            ? currentOrderDetail.result
            : detail,
        )
      })

      setCurrentFetchIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        return nextIndex < orderSlugs.length ? nextIndex : prevIndex
      })
    }
  }, [currentOrderDetail])

  const handleFetchOrders = () => {
    setShouldFetchOrders(true)
    setOrderDetails([])
    setCurrentFetchIndex(0)
  }

  const handleRefetchAll = async () => {
    setOrderDetails([])
    setCurrentFetchIndex(0)
    await allOrderRefetch()
  }

  useEffect(() => {
    if (!shouldFetchOrders) return

    const interval = setInterval(async () => {
      try {
        await allOrderRefetch()
        console.log('Polling: Refreshing orders in the same table...')
      } catch (error) {
        console.error('Error during polling orders:', error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [shouldFetchOrders, allOrderRefetch])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between mt-6">
            {t('order.orderDetail')}
            <Button
              onClick={shouldFetchOrders ? handleRefetchAll : handleFetchOrders}
            >
              {shouldFetchOrders ? t('order.refresh') : t('order.loadOrdersInTheSameTable')}
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
                  <div className="font-medium text-primary">
                    {t('order.currentOrder')}
                  </div>
                  <CustomerInformation
                    orderDetailData={selectedOrder?.result}
                  />
                  <OrderItemList orderDetailData={selectedOrder?.result} />
                </div>
                {orderDetails && orderDetails.length > 0 && (
                  <div className="flex items-center gap-1">
                    <CircleAlert size={14} className="text-blue-500" />
                    <span className='text-sm text-muted-foreground'>{t('order.refreshOrdersInTheSameTable')}</span>
                  </div>
                )}
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

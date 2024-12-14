import {
  CustomerInformation,
  OrderItemList,
} from '@/app/system/order-management'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useOrderBySlug, useOrders, usePagination } from '@/hooks'
import { useOrderTrackingStore, useUserStore } from '@/stores'
import { IOrder } from '@/types'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui'
import {
  CreateOrderTrackingByStaffDialog,
  CreateOrderTrackingByRobotDialog,
} from '../dialog'

interface IOrderItemDetailSheetProps {
  order?: IOrder
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
  const { getSelectedItems } = useOrderTrackingStore()

  // Create an object to store refetch functions for each order
  const orderRefetchMap = useRef<{ [key: string]: () => void }>({})

  useEffect(() => {
    setOrderDetails([])
    setShouldFetchOrders(false)
  }, [order])

  const { data: ordersData, refetch: allOrderRefetch } = useOrders({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ownerSlug: userInfo?.slug,
    order: 'DESC',
    branchSlug: userInfo?.branch.slug,
    table: order?.table?.slug,
    hasPaging: false,
    enabled: shouldFetchOrders && !!order?.table?.slug,
  })

  const { data: orderDetail, refetch: refetchOrderDetail } = useOrderBySlug(
    orderSlugs[orderDetails.length],
    {
      enabled: shouldFetchOrders && orderSlugs.length > orderDetails.length,
    },
  )

  // Store refetch functions when creating order queries
  useEffect(() => {
    if (orderDetail?.result) {
      orderRefetchMap.current[orderDetail.result.slug] = refetchOrderDetail
    }
  }, [orderDetail, refetchOrderDetail])

  // Ensure valid slugs
  useEffect(() => {
    if (ordersData?.result?.items) {
      const validSlugs = ordersData.result.items
        .map((item) => item.slug)
        .filter((slug) => !!slug) // Filter out empty or undefined slugs
      setOrderSlugs(validSlugs)
    }
    console.log('Valid slugs', orderSlugs)
  }, [ordersData])

  // Update order details
  useEffect(() => {
    if (orderDetail?.result) {
      setOrderDetails((prev) => {
        const exists = prev.some(
          (detail) => detail.slug === orderDetail.result.slug,
        )
        if (exists) {
          return prev.map((detail) =>
            detail.slug === orderDetail.result.slug
              ? orderDetail.result
              : detail,
          )
        } else {
          return [...prev, orderDetail.result]
        }
      })
    }
  }, [orderDetail])

  // Refetch every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (shouldFetchOrders && orderSlugs.length > orderDetails.length) {
        refetchOrderDetail()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [orderSlugs, orderDetails.length, shouldFetchOrders, refetchOrderDetail])

  useEffect(() => {
    const interval = setInterval(() => {
      if (shouldFetchOrders && orderDetails.length > 0) {
        orderDetails.forEach((_orderDetail, index) => {
          if (orderSlugs[index] && orderSlugs[index] !== undefined) {
            refetchOrderDetail()
          }
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [orderDetails, orderSlugs, shouldFetchOrders, refetchOrderDetail])

  const handleFetchOrders = () => {
    setShouldFetchOrders(true)
    setOrderDetails([]) // Clear current order details
    allOrderRefetch?.() // Refetch all orders
  }

  // Update handleRefetchAll to use stored refetch functions
  const handleRefetchAll = async () => {
    try {
      await allOrderRefetch?.()

      if (orderDetails.length > 0) {
        orderDetails.forEach((detail) => {
          const refetchFn = orderRefetchMap.current[detail.slug]
          if (refetchFn) {
            refetchFn()
          }
        })
      }
    } catch (error) {
      console.error('Error refetching orders:', error)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between mt-6">
            Thông tin chi tiết
            <Button onClick={handleFetchOrders}>
              {shouldFetchOrders ? 'Refresh Orders' : 'Load Orders'}
            </Button>
          </SheetTitle>
          {getSelectedItems().length > 0 && (
            <div className="flex gap-2">
              <CreateOrderTrackingByStaffDialog />
              <CreateOrderTrackingByRobotDialog onSuccess={handleRefetchAll} />
            </div>
          )}
        </SheetHeader>
        <ScrollArea className="h-[32rem] min-h-fit">
          <div className="mt-4">
            {order ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 p-4 border-2 rounded-lg border-primary bg-primary/5">
                  <div className="font-medium text-primary">Current Order</div>
                  <CustomerInformation orderDetailData={order} />
                  <OrderItemList orderDetailData={order} />
                </div>

                {shouldFetchOrders && (
                  <div className="flex flex-col gap-4">
                    {orderDetails
                      .filter((orderDetail) => orderDetail.slug !== order.slug)
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

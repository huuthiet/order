import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { DataTable, ScrollArea } from '@/components/ui'
import { useOrderBySlug, useOrders, usePagination } from '@/hooks'
import { useOrderStore, useOrderTrackingStore, useUserStore } from '@/stores'
import { IOrder } from '@/types'
import { CreateOrderTrackingByStaffDialog, CreateOrderTrackingByRobotDialog } from '@/components/app/dialog'
import TotalOrders from './total-orders'
import OrderWaitListCounting from './order-wait-list-counting'
import CustomerInformation from './customer-information'
import OrderItemList from './order-item-list'
import { usePendingOrdersColumns } from './DataTable/columns'

export default function OrderManagementPage() {
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation(['common'])
  const [selectedOrderSlug, setSelectedOrderSlug] = useState<string>('')
  const { userInfo } = useUserStore()
  const { addOrder } = useOrderStore()
  const { clearSelectedItems, getSelectedItems } = useOrderTrackingStore()
  const { data: orderDetail, refetch } = useOrderBySlug(selectedOrderSlug)
  const { pagination, handlePageChange, handlePageSizeChange } = usePagination()

  const { data } = useOrders({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    ownerSlug: userInfo?.slug,
    order: 'DESC',
    branchSlug: userInfo?.branch.slug,
  })

  const orders = data?.result.items || []

  useEffect(() => {
    if (orderDetail?.result) {
      addOrder(orderDetail.result)
    }
  }, [orderDetail, addOrder])

  const handleOrderClick = (order: IOrder) => {
    setSelectedOrderSlug(order.slug)
    clearSelectedItems()
  }

  //i want to refetch orderDetail every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5000)
    return () => clearInterval(interval)
  }, [refetch])

  const orderDetailData = orderDetail?.result
  return (
    <div className="flex flex-row flex-1 gap-2 py-4">
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 bg-background">
            <span className="flex items-center justify-start w-full gap-1 text-lg">
              <SquareMenu />
              {t('order.title')}
            </span>
          </div>
          <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-9">
            <div className="flex flex-col col-span-4 gap-2">
              <div className="grid grid-cols-2 gap-2">
                <TotalOrders orders={orders} />
                <OrderWaitListCounting />
              </div>

              {/* Order wait list */}
              <DataTable
                isLoading={false}
                data={data?.result.items || []}
                columns={usePendingOrdersColumns()}
                pages={data?.result?.page || 1}
                onRowClick={handleOrderClick}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />

              {/* <div className="flex flex-1 py-4 border rounded-md">
                <div className="flex flex-col w-full gap-2">
                  <span className="px-6 text-lg font-semibold text-muted-foreground">
                    {t('order.orderList')}
                  </span>
                  <ScrollArea className="max-h-[28rem] w-full flex-1 px-3">
                    <div className="flex flex-col gap-1">
                      {sortedPendingOrders.map((pendingOrder) => (
                        <div
                          onClick={() => handleOrderClick(pendingOrder)}
                          key={pendingOrder.slug}
                          className={`grid cursor-pointer grid-cols-4 ${currentOrders?.slug === pendingOrder.slug ? 'border border-primary bg-primary/10' : ''} flex-row items-center rounded-md px-2 py-3 transition-colors duration-200 hover:bg-primary/10`}
                        >
                          <div className="flex justify-start col-span-2 gap-4">
                            <div className="flex items-center justify-start rounded-lg bg-primary p-2.5">
                              <ShoppingCartIcon className="text-white icon" />
                            </div>
                            <div className="flex flex-col justify-start text-sm">
                              <span>
                                {pendingOrder.owner.firstName}{' '}
                                {pendingOrder.owner.lastName}
                              </span>
                              <div className="flex flex-row gap-1 text-xs text-muted-foreground/50">
                                <span>{pendingOrder.orderItems.length}</span>
                                {t('order.item')}
                              </div>
                            </div>
                          </div>
                          <span className="flex flex-row items-center justify-start gap-1 text-[0.5rem] text-muted-foreground/60">
                            <Clock size={12} />
                            {moment(pendingOrder.createdAt).format(
                              'hh:mm DD/MM/YYYY',
                            )}
                          </span>
                          <OrderStatusBadge status={pendingOrder.status} />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div> */}
            </div>

            {/* Order Information */}
            <div className="flex flex-col col-span-5 gap-1 py-4 border rounded-md">
              <span className="px-4 text-lg font-medium">
                {t('order.orderInformation')}
              </span>
              <div>
                {orderDetailData ? (
                  <div className="flex flex-col gap-2">
                    {/* Customer Information */}
                    <CustomerInformation orderDetailData={orderDetailData} />
                    {/* Danh sách sản phẩm */}
                    <OrderItemList orderDetailData={orderDetailData} />
                  </div>
                ) : (
                  <p className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
                    {tCommon('common.noData')}
                  </p>
                )}
              </div>
              {getSelectedItems().length > 0 && (
                <div className="flex justify-end w-full gap-2">
                  <CreateOrderTrackingByStaffDialog />
                  <CreateOrderTrackingByRobotDialog />
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

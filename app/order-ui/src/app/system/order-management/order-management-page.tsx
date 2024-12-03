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
  const [selectedRow, setSelectedRow] = useState<string>('')
  const { userInfo } = useUserStore()
  const { addOrder } = useOrderStore()
  const { clearSelectedItems, getSelectedItems } = useOrderTrackingStore()
  const { data: orderDetail, refetch } = useOrderBySlug(selectedOrderSlug)
  const { pagination, handlePageChange, handlePageSizeChange } = usePagination()

  const { data, refetch: allOrderRefetch } = useOrders({
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    ownerSlug: userInfo?.slug,
    order: 'DESC',
    branchSlug: userInfo?.branch.slug,
  })

  useEffect(() => {
    if (orderDetail?.result) {
      addOrder(orderDetail.result)
    }
  }, [orderDetail, addOrder])

  const handleOrderClick = (order: IOrder) => {
    setSelectedOrderSlug(order.slug)
    setSelectedRow(order.slug)
    clearSelectedItems()
  }

  //i want to refetch orderDetail every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
      allOrderRefetch()
    }, 5000)
    return () => clearInterval(interval)
  }, [refetch, allOrderRefetch])

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
                <TotalOrders orderTotal={data?.result.total} />
                <OrderWaitListCounting />
              </div>

              {/* Order wait list */}
              <DataTable
                isLoading={false}
                data={data?.result.items || []}
                columns={usePendingOrdersColumns()}
                pages={data?.result?.totalPages || 1}
                onRowClick={handleOrderClick}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                rowClassName={(row) =>
                  row.slug === selectedRow ? 'bg-primary/20 border border-primary' : ''
                }
              />
            </div>

            {/* Order Information */}
            <div className="flex flex-col col-span-5 gap-1 py-4 border rounded-md">
              <span className="px-4 text-lg font-semibold">
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

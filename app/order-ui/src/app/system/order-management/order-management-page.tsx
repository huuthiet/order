import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { DataTable, ScrollArea } from '@/components/ui'
import { useOrderBySlug, useOrders, usePagination } from '@/hooks'
import { useOrderStore, useOrderTrackingStore, useUserStore } from '@/stores'
import { IOrder, OrderStatus } from '@/types'
import { usePendingOrdersColumns } from './DataTable/columns'
import { OrderItemDetailSheet } from '@/components/app/sheet'

export default function OrderManagementPage() {
  const { t } = useTranslation(['menu'])
  const [selectedOrderSlug, setSelectedOrderSlug] = useState<string>('')
  const [selectedRow, setSelectedRow] = useState<string>('')
  const { userInfo } = useUserStore()
  const { addOrder } = useOrderStore()
  const { clearSelectedItems } = useOrderTrackingStore()
  const { data: orderDetail } = useOrderBySlug(selectedOrderSlug)
  const { pagination, handlePageChange, handlePageSizeChange } = usePagination()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
  }

  const { data, isLoading } = useOrders({
    hasPaging: true,
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ownerSlug: userInfo?.slug,
    order: 'DESC',
    branchSlug: userInfo?.branch.slug,
    // status: [OrderStatus.PAID, OrderStatus.SHIPPING].join(','),
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
    setIsSheetOpen(true)
  }

  return (
    <div className="flex flex-1 flex-row gap-2 py-4">
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4">
            <span className="flex w-full items-center justify-start gap-1 text-lg">
              <SquareMenu />
              {t('order.title')}
            </span>
          </div>
          <div className="grid h-full grid-cols-1 gap-2">
            <div className="col-span-4 flex flex-col gap-2">
              <DataTable
                isLoading={isLoading}
                data={data?.result.items || []}
                columns={usePendingOrdersColumns()}
                pages={data?.result?.totalPages || 1}
                onRowClick={handleOrderClick}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                rowClassName={(row) =>
                  row.slug === selectedRow
                    ? 'bg-primary/20 border border-primary'
                    : ''
                }
              />
            </div>

            <OrderItemDetailSheet
              order={selectedOrderSlug}
              isOpen={isSheetOpen}
              onClose={handleCloseSheet}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

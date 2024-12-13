import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { ScrollArea, DataTable } from '@/components/ui'
import { useOrders, usePagination } from '@/hooks'
import { useUserStore } from '@/stores'
import { useOrderHistoryColumns } from './DataTable/columns'

export default function OrderHistoryPage() {
    const { t } = useTranslation(['menu'])
    const { userInfo } = useUserStore()
    const { pagination, handlePageChange, handlePageSizeChange } = usePagination()

    const { data, isLoading } = useOrders({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        ownerSlug: userInfo?.slug,
        order: 'DESC',
        branchSlug: userInfo?.branch.slug,
    })

    return (
        <ScrollArea className="flex-1">
            <div className='flex flex-col'>
                <div className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-background">
                    <span className="flex items-center justify-start w-full gap-1 text-lg">
                        <SquareMenu />
                        {t('order.title')}
                    </span>
                </div>
                <DataTable
                    columns={useOrderHistoryColumns()}
                    data={data?.result.items || []}
                    isLoading={isLoading}
                    pages={data?.result.totalPages || 0}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </ScrollArea>
    )
}

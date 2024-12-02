import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { Input, ScrollArea, Button, DataTable } from '@/components/ui'
import { useOrders, usePagination } from '@/hooks'
import { useUserStore } from '@/stores'
import { useOrderHistoryColumns } from './DataTable/columns'

export default function OrderHistoryPage() {
    const { t } = useTranslation(['menu'])
    const { userInfo } = useUserStore()
    const { pagination, handlePageChange, handlePageSizeChange } = usePagination()

    const { data, isLoading } = useOrders({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        ownerSlug: userInfo?.slug,
        order: 'DESC',
        branchSlug: userInfo?.branch.slug,
    })

    return (
        <div className="flex flex-row flex-1 gap-2">
            <ScrollArea className="flex-1">
                <div className='flex flex-col gap-4'>
                    <div className="flex flex-col">
                        <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 bg-background">
                            <span className="flex items-center justify-start w-full gap-1 text-lg">
                                <SquareMenu />
                                {t('order.title')}
                            </span>
                        </div>
                    </div>
                    <div className='grid grid-cols-2'>
                        <div className='col-span-1'></div>
                        <div className='flex items-center justify-end col-span-1 gap-2'>
                            <Input placeholder="Tìm kiếm" />
                            <Button>Tìm kiếm</Button>
                        </div>
                    </div>
                    <div className='p-4 border rounded-md'>
                        <DataTable
                            columns={useOrderHistoryColumns()}
                            data={data?.result.items || []}
                            isLoading={isLoading}
                            pages={1}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

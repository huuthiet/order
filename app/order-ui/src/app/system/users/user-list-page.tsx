import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { ScrollArea, DataTable } from '@/components/ui'
import { useUsers, usePagination } from '@/hooks'
import { useUserListColumns } from './DataTable/columns'

export default function UserListPage() {
    const { t } = useTranslation(['user'])
    const { pagination, handlePageChange, handlePageSizeChange } = usePagination()

    const { data, isLoading } = useUsers({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order: 'DESC',
    })

    return (
        <ScrollArea className="flex-1">
            <div className='flex flex-col'>
                <div className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-background">
                    <span className="flex items-center justify-start w-full gap-1 text-lg">
                        <SquareMenu />
                        {t('users.title')}
                    </span>
                </div>
                <DataTable
                    columns={useUserListColumns()}
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

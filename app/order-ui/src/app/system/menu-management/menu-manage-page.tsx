import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { DataTable } from '@/components/ui'
import { useAllMenus, usePagination } from '@/hooks'
import { useMenusColumns } from './DataTable/columns'
import { MenusActionOptions } from './DataTable/actions'
import { useUserStore } from '@/stores'
import { IsTemplateFilter } from './DataTable/filters'

export default function MenuManagementPage() {
  const { t } = useTranslation(['menu'])
  const { userInfo } = useUserStore()
  const { pagination, handlePageChange, handlePageSizeChange } = usePagination()
  const { data, isLoading } = useAllMenus({
    order: 'DESC',
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
    branch: userInfo?.branch.slug,
  })

  return (
    <div className={`transition-all duration-300 ease-in-out`}>
      <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4">
        <span className="flex w-full items-center justify-start gap-1 text-lg">
          <SquareMenu />
          {t('menu.title')}
        </span>
        <div className="grid h-full w-full grid-cols-1">
          <DataTable
            columns={useMenusColumns()}
            data={data?.result.items || []}
            isLoading={isLoading}
            pages={data?.result?.totalPages || 0}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            actionOptions={MenusActionOptions}
            filterOptions={IsTemplateFilter}
          />
        </div>
      </div>
    </div>
  )
}

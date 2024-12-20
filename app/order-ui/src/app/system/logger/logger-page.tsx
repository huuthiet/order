import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { ScrollArea, DataTable } from '@/components/ui'
import { useLoggerColumns } from './DataTable/columns'
import { useLogger, usePagination } from '@/hooks'
import { LoggerLevelFilter } from './DataTable/filters'

export default function LoggerPage() {
  const { t } = useTranslation(['log'])
  const { pagination, handlePageChange, handlePageSizeChange } = usePagination()
  const { data: loggers, isLoading } = useLogger({
    order: 'DESC',
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  })

  return (
    <div className={`pl-4 transition-all duration-300 ease-in-out`}>
      <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 pr-4">
        <div className="flex w-full flex-1 flex-col">
          <span className="flex items-center gap-1 text-lg">
            <SquareMenu />
            {t('log.title')}
          </span>
          <div className="grid h-full grid-cols-1 gap-2">
            <DataTable
              columns={useLoggerColumns()}
              data={loggers?.result?.items || []}
              isLoading={isLoading}
              pages={loggers?.result?.totalPages || 0}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              filterOptions={LoggerLevelFilter}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

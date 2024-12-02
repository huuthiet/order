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
    <div className="flex flex-row h-full gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`pl-4 transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 pr-4 bg-background">
            <div className="flex flex-col flex-1 w-full">
              <span className="flex items-center gap-1 text-lg">
                <SquareMenu />
                {t('log.title')}
              </span>
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
      </ScrollArea>
    </div>
  )
}

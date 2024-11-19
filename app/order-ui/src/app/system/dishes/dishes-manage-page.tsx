import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { ScrollArea, DataTable } from '@/components/ui'
import { useProducts } from '@/hooks/use-product'
import { useProductColumns } from './DataTable/columns'

export default function DishesManagementPage() {
  const { t } = useTranslation(['product'])
  const { data: products, isLoading } = useProducts()
  return (
    <div className="flex flex-row gap-2 h-[calc(100vh-4rem)]">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`transition-all duration-300 ease-in-out pl-4`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 py-3 pr-4 bg-background">
            <div className="flex flex-row items-center justify-between w-full">
              <BreadcrumbComponent />
            </div>
            <div className="flex flex-col flex-1 w-full mt-4">
              <span className="flex items-center gap-1 text-lg">
                <SquareMenu />
                {t('product.title')}
              </span>
              <DataTable
                columns={useProductColumns()}
                data={products?.result || []}
                isLoading={isLoading}
                pages={1}
                onPageChange={() => {}}
                onPageSizeChange={() => {}}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

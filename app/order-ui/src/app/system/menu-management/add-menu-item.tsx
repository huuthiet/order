import { useTranslation } from 'react-i18next'

import { DataTable, ScrollArea } from '@/components/ui'
import { useProducts } from '@/hooks'
import { useProductColumns } from './DataTable/columns'

export default function AddMenuItem() {
  const { t } = useTranslation(['menu'])
  const { data: products, isLoading } = useProducts()

  const productsData = products?.result

  console.log(productsData)

  return (
    <div className="flex h-full flex-col bg-transparent backdrop-blur-md">
      {/* Header */}
      <div className="px-4 pt-2">
        <h1 className="text-lg font-medium">{t('menu.addMenuItem')}</h1>
      </div>

      {/* Product List */}
      <ScrollArea className="mt-2 flex-1">
        <div className="flex flex-1 flex-col gap-4 px-4 pb-8">
          <div className="flex flex-col gap-4 space-y-2 py-2">
            <DataTable
              columns={useProductColumns()}
              data={productsData || []}
              isLoading={isLoading}
              pages={1}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

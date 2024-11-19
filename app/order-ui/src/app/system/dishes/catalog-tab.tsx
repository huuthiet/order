import { DataTable } from '@/components/ui'
import { useCatalogColumns } from './DataTable/columns'
import { useCatalog } from '@/hooks'
import ProductActionOptions from './DataTable/actions/product-action-options'

export default function ProductManagementPage() {
  const { data: catalog, isLoading } = useCatalog()
  return (
    <div className="flex flex-row gap-2 h-[calc(100vh-4rem)]">
      <DataTable
        columns={useCatalogColumns()}
        data={catalog?.result || []}
        isLoading={isLoading}
        pages={1}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        actionOptions={ProductActionOptions}
      />
    </div>
  )
}

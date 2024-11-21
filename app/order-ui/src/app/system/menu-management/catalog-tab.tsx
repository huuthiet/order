import { DataTable } from '@/components/ui'
import { useCatalogColumns } from './DataTable/columns'
import { useCatalog } from '@/hooks'
import { CatalogActionOptions } from './DataTable/actions'

export default function CatalogTab() {
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
        actionOptions={CatalogActionOptions}
      />
    </div>
  )
}

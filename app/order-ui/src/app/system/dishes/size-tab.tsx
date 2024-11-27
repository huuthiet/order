import { DataTable } from '@/components/ui'
import { useSizeColumns } from './DataTable/columns'
import { useSize } from '@/hooks'
import { SizeActionOptions } from './DataTable/actions'

export default function SizeTab() {
  const { data: sizes, isLoading } = useSize()
  return (
    <div className="flex h-full flex-row gap-2">
      <DataTable
        columns={useSizeColumns()}
        data={sizes?.result || []}
        isLoading={isLoading}
        pages={1}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        actionOptions={SizeActionOptions}
      />
    </div>
  )
}

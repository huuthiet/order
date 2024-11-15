import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import TableLayout from './table-layout'

export default function TablePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center p-4">
        <BreadcrumbComponent />
      </div>

      <div className="overflow-hidden flex-1">
        <div className="relative w-full h-full">
          <TableLayout />
        </div>
      </div>
    </div>
  )
}

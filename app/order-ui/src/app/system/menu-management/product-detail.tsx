// import { useTranslation } from 'react-i18next'

import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { ScrollArea } from '@/components/ui'
// import { useProductDetailColumns } from './DataTable/columns'

export default function ProductManagementPage() {
  // const { t } = useTranslation(['product'])
  return (
    <div className="flex flex-row gap-2 h-[calc(100vh-4rem)]">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`transition-all duration-300 ease-in-out pl-4`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 py-3 pr-4 bg-background">
            <div className="flex flex-row items-center justify-between w-full">
              <BreadcrumbComponent />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

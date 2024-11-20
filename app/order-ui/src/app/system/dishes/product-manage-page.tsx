import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { ScrollArea, DataTable, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { useProducts } from '@/hooks/use-product'
import { useProductColumns } from './DataTable/columns/columns'
import { CatalogTab, SizeTab } from '.'

export default function ProductManagementPage() {
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
              <Tabs defaultValue="catalog" className="w-full">
                <TabsList className="grid grid-cols-3 w-96">
                  <TabsTrigger value="catalog">{t('tab.catalog')}</TabsTrigger>
                  <TabsTrigger value="size">{t('tab.size')}</TabsTrigger>
                  <TabsTrigger value="product">{t('tab.product')}</TabsTrigger>
                </TabsList>
                <TabsContent value="catalog" className="w-full">
                  <CatalogTab />
                </TabsContent>
                <TabsContent value="size" className="w-full">
                  <SizeTab />
                </TabsContent>
                <TabsContent value="product">
                  <DataTable
                    columns={useProductColumns()}
                    data={products?.result || []}
                    isLoading={isLoading}
                    pages={1}
                    onPageChange={() => {}}
                    onPageSizeChange={() => {}}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

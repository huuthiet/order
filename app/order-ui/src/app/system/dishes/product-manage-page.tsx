import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import {
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { CatalogTab, SizeTab, ProductTab } from '.'

export default function ProductManagementPage() {
  const { t } = useTranslation(['product'])
  return (
    <div className="flex h-full flex-row gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`pl-4 transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 pr-4">
            <div className="mt-4 flex w-full flex-1 flex-col">
              <span className="flex items-center gap-1 text-lg">
                <SquareMenu />
                {t('product.title')}
              </span>
              <Tabs defaultValue="product" className="w-full">
                <TabsList className="grid w-96 grid-cols-3">
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
                  <ProductTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

import { useTranslation } from 'react-i18next'

import { Button, DataTable, ScrollArea } from '@/components/ui'
import { useProducts } from '@/hooks'
import { useProductColumns } from './DataTable/columns'
import { useMenuItemStore } from '@/stores'
import { AddMultipleItemsDialog } from '@/components/app/dialog'

export default function AddMenuItem() {
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation(['common'])
  const { getMenuItems, clearMenuItems } = useMenuItemStore()
  const { data: products, isLoading } = useProducts()

  const productsData = products?.result
  const menuItems = getMenuItems()

  return (
    <div className="flex h-full flex-col bg-transparent backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-2">
        <h1 className="text-lg font-medium">{t('menu.addMenuItem')}</h1>

        {/* Hiển thị số lượng items đã chọn */}
        {menuItems.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {t('menu.selectedItems', { count: menuItems.length })}
          </span>
        )}
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

          {/* Hiển thị nút thêm khi có items được chọn */}
          {menuItems.length > 0 && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => clearMenuItems()}>
                {tCommon('common.cancel')}
              </Button>
              <AddMultipleItemsDialog products={menuItems} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

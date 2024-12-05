import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { DataTable, ScrollArea } from '@/components/ui'
import { useAllMenus, usePagination } from '@/hooks'
import { useMenusColumns } from './DataTable/columns'
import { MenusActionOptions } from './DataTable/actions'
import { useUserStore } from '@/stores'

export default function MenuManagementPage() {
  const { t } = useTranslation(['menu'])
  const { userInfo } = useUserStore()
  const { pagination, handlePageChange, handlePageSizeChange } = usePagination()
  const { data, isLoading } = useAllMenus(
    {
      order: 'DESC',
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      branch: userInfo?.branch.slug,
    }
  )

  return (
    <div className="flex flex-row h-full gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`pl-4 transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 pr-4 bg-background">
            <span className="flex items-center justify-start w-full gap-1 text-lg">
              <SquareMenu />
              {t('menu.title')}
            </span>
            <DataTable
              columns={useMenusColumns()}
              data={data?.result.items || []}
              isLoading={isLoading}
              pages={data?.result?.totalPages || 0}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              // onRowClick={handleRowClick}
              actionOptions={MenusActionOptions}
            />
            {/* <div className="flex flex-col flex-1 w-full mt-4">
              <span className="flex items-center gap-1 text-lg">
                <SquareMenu />
                {t('menu.title')}
              </span>
              {isLoading ? (
                <p>{t('menu.loading')}</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {menus?.map((menu) => (
                    <div
                      key={menu.slug}
                      className="flex flex-col gap-4 bg-red-200"
                    >
                      <h2 className="text-lg font-bold">
                        {t('menu.date')}:{' '}
                        {new Date(menu.date).toLocaleDateString()}
                      </h2>
                      {menu.menuItems.map((item) => (
                        <div
                          key={item.slug}
                          className="flex gap-4 p-4 bg-white border rounded-lg shadow-sm"
                        >
                          <img
                            src={`${publicFileURL}/${item.product.image}`}
                            alt={item.product.name}
                            className="object-cover w-20 h-20 rounded-md"
                          />
                          <div className="flex flex-col justify-between">
                            <h3 className="text-base font-semibold">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.product.description}
                            </p>
                            {item.product.variants.length > 0 && (
                              <p className="text-sm font-medium">
                                {t('menu.price')}:{' '}
                                {formatCurrency(item.product.variants[0].price)}
                              </p>
                            )}
                            <p className="text-sm">
                              {t('menu.stock')}: {item.currentStock}/
                              {item.defaultStock}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

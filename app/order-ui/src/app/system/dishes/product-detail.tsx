import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { ScrollArea, DataTable } from '@/components/ui'
import { useProductBySlug } from '@/hooks'
// import { useProductDetailColumns } from './DataTable/columns'
import { publicFileURL } from '@/constants'
import { ProductRating } from '.'
import { useProductVariantColumns } from './DataTable/columns'
import { ProductVariantActionOptions } from './DataTable/actions'
import { ProductDetailSkeleton } from '@/components/app/skeleton'

export default function ProductManagementPage() {
  const { t } = useTranslation(['product'])
  const { slug } = useParams()
  const { data: product, isLoading } = useProductBySlug(slug as string)
  const productDetailColumns = useProductVariantColumns()

  const productDetail = product?.result

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  return (
    <div className="flex flex-row gap-2 h-[calc(100vh-4rem)]">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`transition-all duration-300 ease-in-out pl-4`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 py-3 pr-4 bg-background">
            <div className="flex flex-row items-center justify-between w-full">
              <BreadcrumbComponent />
            </div>
            <div className="flex flex-col flex-1 w-full mt-1">
              <div className="flex flex-row items-center justify-between">
                <span className="flex items-center gap-1 text-lg">
                  <SquareMenu />
                  {t('product.title')}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid w-full grid-cols-2 gap-4 pb-8 mt-4 border-b">
                  <div className="flex flex-col h-full col-span-1 gap-2">
                    {productDetail && (
                      <img
                        src={`${publicFileURL}/${productDetail.image}`}
                        alt={productDetail.name}
                        className="object-cover w-[calc(100%-1rem)] rounded-xl"
                      />
                    )}
                    <div className="grid grid-cols-4">
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="object-cover w-[calc(100%-1rem)] rounded-md"
                        />
                      )}
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="object-cover w-[calc(100%-1rem)] rounded-md"
                        />
                      )}
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="object-cover w-[calc(100%-1rem)] rounded-md"
                        />
                      )}
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="object-cover w-[calc(100%-1rem)] rounded-md"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    {productDetail && (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <div>
                            <span className="text-3xl font-semibold">{productDetail.name}</span>
                          </div>
                          <div>
                            <span className="text-md text-muted-foreground">
                              {productDetail.description}
                            </span>
                          </div>
                          <div className="mt-2">
                            <ProductRating rating={productDetail.rating} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="mt-2 text-xl font-semibold">{t('product.variant')}</span>
                </div>
                <DataTable
                  columns={productDetailColumns}
                  data={productDetail?.variants || []}
                  isLoading={isLoading}
                  pages={1}
                  onPageChange={() => {}}
                  onPageSizeChange={() => {}}
                  actionOptions={ProductVariantActionOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

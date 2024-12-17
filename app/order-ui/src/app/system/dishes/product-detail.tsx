import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { ScrollArea, DataTable } from '@/components/ui'
import { useProductBySlug } from '@/hooks'
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
    <div className="flex h-full flex-row gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`pl-4 transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 pr-4">
            <div className="mt-1 flex w-full flex-1 flex-col">
              <div className="flex flex-row items-center justify-between">
                <span className="flex items-center gap-1 text-lg">
                  <SquareMenu />
                  {t('product.title')}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="mt-4 grid w-full grid-cols-2 gap-4 border-b pb-8">
                  <div className="col-span-1 flex h-full flex-col gap-2">
                    {productDetail && (
                      <img
                        src={`${publicFileURL}/${productDetail.image}`}
                        alt={productDetail.name}
                        className="w-[calc(100%-1rem)] rounded-xl object-cover"
                      />
                    )}
                    <div className="grid grid-cols-4">
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="w-[calc(100%-1rem)] rounded-md object-cover"
                        />
                      )}
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="w-[calc(100%-1rem)] rounded-md object-cover"
                        />
                      )}
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="w-[calc(100%-1rem)] rounded-md object-cover"
                        />
                      )}
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="w-[calc(100%-1rem)] rounded-md object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    {productDetail && (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <div>
                            <span className="text-3xl font-semibold">
                              {productDetail.name}
                            </span>
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
                <div className="flex w-full items-center justify-between">
                  <span className="mt-2 text-xl font-semibold">
                    {t('product.variant')}
                  </span>
                </div>
                {/* Product Variants  */}
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

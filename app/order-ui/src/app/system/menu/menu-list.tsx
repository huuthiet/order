import { useTranslation } from 'react-i18next'

import { SkeletonMenuList } from '@/components/app/skeleton'
import { useProducts } from '@/hooks'
import { IProduct } from '@/types'
import { publicFileURL } from '@/constants'
import AddToCartDialog from '@/components/app/dialog/add-to-cart-dialog'

interface IMenuProps {
  isCartOpen: boolean
}

export default function MenuList({ isCartOpen }: IMenuProps) {
  const { t } = useTranslation('menu')
  const { data, isLoading } = useProducts()

  const products = data?.result

  const getPriceRange = (variants: IProduct['variants']) => {
    if (!variants || variants.length === 0) return null

    const prices = variants.map((v) => v.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    return {
      min: minPrice,
      max: maxPrice,
      isSinglePrice: minPrice === maxPrice
    }
  }

  if (isLoading) {
    return (
      <div className={`grid ${isCartOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-3`}>
        {[...Array(8)].map((_, index) => (
          <SkeletonMenuList key={index} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return <p className="text-center">{t('menu.noData')}</p>
  }

  return (
    <div className={`grid ${isCartOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
      {products.map((item) => (
        <div key={item.slug} className="flex flex-col border rounded-xl backdrop-blur-md">
          {/* Image Section with Discount Tag */}
          <div className="relative">
            {item.image ? (
              <img
                src={`${publicFileURL}/${item.image}`}
                alt={item.name}
                className="object-cover w-full h-40 rounded-t-md"
              />
            ) : (
              <div className="w-full h-40 rounded-t-md bg-muted/60" />
            )}

            {/* Discount Tag */}
            {/* {dish.discount && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                  Giảm {dish.discount}%
                </span>
              </div>
            )} */}
          </div>

          {/* Content Section - More compact */}
          <div className="flex flex-col flex-1 p-4 space-y-1.5">
            <h3 className="font-bold text-md line-clamp-1">{item.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>

            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col">
                {item.variants.length > 0 ? (
                  <span className="text-lg font-bold text-primary">
                    {(() => {
                      const range = getPriceRange(item.variants)
                      if (!range) return '0đ'
                      return range.isSinglePrice
                        ? `${range.min.toLocaleString('vi-VN')}đ`
                        : `${range.min.toLocaleString('vi-VN')}đ - ${range.max.toLocaleString('vi-VN')}đ`
                    })()}
                  </span>
                ) : (
                  <span className="text-lg font-bold text-primary">Liên hệ</span>
                )}
              </div>
            </div>
            <AddToCartDialog product={item} />
          </div>
        </div>
      ))}
    </div>
  )
}

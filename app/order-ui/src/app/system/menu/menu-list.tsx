import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { SkeletonMenuList } from '@/components/app/skeleton'
import { useSpecificMenu } from '@/hooks'
import { IProduct } from '@/types'
import { publicFileURL } from '@/constants'
import { AddToCartDialog } from '@/components/app/dialog'

interface IMenuProps {
  isCartOpen: boolean
}

export default function MenuList({ isCartOpen }: IMenuProps) {
  const { t } = useTranslation('menu')
  function getCurrentDate() {
    return moment().format('YYYY-MM-DD')
  }
  const { data: specificMenu, isLoading } = useSpecificMenu({
    date: getCurrentDate(),
  })

  const menuItems = specificMenu?.result.menuItems

  const getPriceRange = (variants: IProduct['variants']) => {
    if (!variants || variants.length === 0) return null

    const prices = variants.map((v) => v.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    return {
      min: minPrice,
      max: maxPrice,
      isSinglePrice: minPrice === maxPrice,
    }
  }

  if (isLoading) {
    return (
      <div
        className={`grid ${isCartOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-3`}
      >
        {[...Array(8)].map((_, index) => (
          <SkeletonMenuList key={index} />
        ))}
      </div>
    )
  }

  if (!menuItems || menuItems.length === 0) {
    return <p className="text-center">{t('menu.noData')}</p>
  }

  return (
    <div
      className={`grid ${isCartOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}
    >
      {menuItems.map((item) => (
        <div
          key={item.slug}
          className="flex flex-col rounded-xl border backdrop-blur-md"
        >
          {/* Image Section with Discount Tag */}
          <div className="relative">
            {item.product.image ? (
              <img
                src={`${publicFileURL}/${item.product.image}`}
                alt={item.product.name}
                className="h-40 w-full rounded-t-md object-cover"
              />
            ) : (
              <div className="h-40 w-full rounded-t-md bg-muted/60" />
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
          <div className="flex flex-1 flex-col space-y-1.5 p-4">
            <h3 className="text-md line-clamp-1 font-bold">
              {item.product.name}
            </h3>
            <p className="line-clamp-2 text-xs text-gray-500">
              {item.product.description}
            </p>

            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col">
                {item.product.variants.length > 0 ? (
                  <span className="text-lg font-bold text-primary">
                    {(() => {
                      const range = getPriceRange(item.product.variants)
                      if (!range) return '0đ'
                      return range.isSinglePrice
                        ? `${range.min.toLocaleString('vi-VN')}đ`
                        : `${range.min.toLocaleString('vi-VN')}đ - ${range.max.toLocaleString('vi-VN')}đ`
                    })()}
                  </span>
                ) : (
                  <span className="text-lg font-bold text-primary">
                    Liên hệ
                  </span>
                )}
              </div>
            </div>
            <AddToCartDialog product={item.product} />
          </div>
        </div>
      ))}
    </div>
  )
}

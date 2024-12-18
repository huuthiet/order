import { useTranslation } from 'react-i18next'

import { SkeletonMenuList } from '@/components/app/skeleton'
import { IProduct, ISpecificMenu } from '@/types'
import { publicFileURL } from '@/constants'
import { AddToCartDialog } from '@/components/app/dialog'
import { Button } from '@/components/ui'

interface IMenuProps {
  menu: ISpecificMenu | undefined
  isLoading: boolean
  isCartOpen: boolean
}

export default function MenuList({ menu, isLoading, isCartOpen }: IMenuProps) {
  const { t } = useTranslation('menu')


  const menuItems = menu?.menuItems

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
        className={`grid grid-cols-1 ${isCartOpen ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-3`}
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
      className={` grid grid-cols-2 ${isCartOpen ? 'lg:grid-cols-4' : 'lg:grid-cols-5'} gap-4`}
    >
      {menuItems.map((item) => (
        <div
          key={item.slug}
          className="flex flex-col bg-white border rounded-xl backdrop-blur-md"
        >
          {/* Image Section with Discount Tag */}
          <div className="relative">
            {item.product.image ? (
              <img
                src={`${publicFileURL}/${item.product.image}`}
                alt={item.product.name}
                className="object-cover w-full h-24 rounded-t-md"
              />
            ) : (
              <div className="w-full h-24 rounded-t-md bg-muted/60" />
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
          <div className="flex flex-1 flex-col space-y-1.5 p-2">
            <h3 className="text-sm font-bold line-clamp-1">
              {item.product.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2">
              {item.product.description}
            </p>

            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col">
                {item.product.variants.length > 0 ? (
                  <div className='flex flex-col items-start justify-start gap-1'>
                    <span className="text-sm font-bold text-primary">
                      {(() => {
                        const range = getPriceRange(item.product.variants)
                        if (!range) return '0đ'
                        return range.isSinglePrice
                          ? `${range.min.toLocaleString('vi-VN')}đ`
                          : `${range.min.toLocaleString('vi-VN')}đ - ${range.max.toLocaleString('vi-VN')}đ`
                      })()}
                    </span>
                    <span className='text-[0.7rem] text-muted-foreground'>
                      {t('menu.amount')}
                      {item.currentStock}/{item.defaultStock}</span>
                  </div>
                ) : (
                  <span className="text-sm font-bold text-primary">
                    Liên hệ
                  </span>
                )}
              </div>
            </div>
            {item.currentStock > 0 ? (
              <AddToCartDialog product={item.product} />
            ) : (
              <Button
                className="flex items-center justify-center w-full py-2 text-sm font-semibold text-white bg-red-500 rounded-full"
                disabled
              >
                Hết hàng
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

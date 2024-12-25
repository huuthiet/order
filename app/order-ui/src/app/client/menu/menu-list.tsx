import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { SkeletonMenuList } from '@/components/app/skeleton'
import { IProduct, ISpecificMenu } from '@/types'
import { publicFileURL, ROUTE } from '@/constants'
import { Button } from '@/components/ui'
// import { AddToCartDialog } from '@/components/app/dialog'

interface IMenuProps {
  menu: ISpecificMenu | undefined
  isLoading: boolean
}

export default function MenuList({ menu, isLoading }: IMenuProps) {
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
        className={`grid grid-cols-1 sm:grid-cols-6 gap-3`}
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
      className={` grid grid-cols-2 py-4 lg:grid-cols-5 gap-4`}
    >
      {menuItems.map((item) => (
        <NavLink
          key={item.slug}
          to={`${ROUTE.CLIENT_MENU}/${item.product.slug}`}>
          <div
            key={item.slug}
            className="flex flex-col min-h-[20rem] transition-all duration-300 bg-white border hover:shadow-xl hover:scale-105 rounded-xl backdrop-blur-md"
          >
            {/* Image Section with Discount Tag */}
            <div className="relative">
              {item.product.image ? (
                <img
                  src={`${publicFileURL}/${item.product.image}`}
                  alt={item.product.name}
                  className="object-cover w-full h-36 rounded-t-md"
                />
              ) : (
                <div className="w-full h-24 rounded-t-md bg-muted/60" />
              )}

              {/* Discount Tag */}
              {/* {item.discount && (
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                  Giảm {item.discount}%
                </span>
              </div>
            )} */}
            </div>

            {/* Content Section - More compact */}
            <div className="flex flex-1 flex-col space-y-1.5  justify-between p-2">
              <div>
                <h3 className="text-lg font-bold line-clamp-1">
                  {item.product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.product.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-1">
                <div className="flex flex-col">
                  {item.product.variants.length > 0 ? (
                    <div className='flex flex-col items-start justify-start gap-1'>
                      <span className="text-lg font-bold text-primary">
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
                      {t('menu.contactForPrice')}
                    </span>
                  )}
                </div>
              </div>
              {item.currentStock > 0 ? (
                <div className='flex items-end justify-center w-full'>
                  {/* <AddToCartDialog product={item.product} /> */}
                </div>
              ) : (
                <Button
                  className="flex items-center justify-center w-full py-2 text-sm font-semibold text-white bg-red-500 rounded-full"
                  disabled
                >
                  {t('menu.outOfStock')}
                </Button>
              )}
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  )
}

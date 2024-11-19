import { SkeletonMenuList } from '@/components/app/skeleton'
import { useDishes } from '@/hooks/use-dishes'
import { Button } from '@/components/ui'
import { useCartItemStore } from '@/stores/cart.store'
import { IDish } from '@/types'
import { ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface IMenuProps {
  isCartOpen: boolean
}

export default function MenuList({ isCartOpen }: IMenuProps) {
  const { t } = useTranslation('menu')
  const { data, isLoading } = useDishes()
  const { addCartItem } = useCartItemStore()

  const handleAddCartItem = (dish: IDish) => {
    addCartItem(dish)
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

  if (!data || data.length === 0) {
    return <p className="text-center">{t('menu.noData')}</p>
  }

  return (
    <div className={`grid ${isCartOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
      {data.map((dish) => (
        <div key={dish.id} className="flex flex-col border backdrop-blur-md rounded-xl">
          {/* Image Section with Discount Tag */}
          <div className="relative">
            <img
              src={dish.image}
              alt={dish.name}
              className="object-cover w-full h-32 rounded-t-md"
            />

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
            <h3 className="font-bold text-md line-clamp-1">{dish.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{dish.description}</p>

            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary">
                  {dish.price.toLocaleString('vi-VN')}đ
                </span>
                {/* {dish.discount && (
                  <span className="text-xs line-through text-muted-foreground">
                    {((dish.price * (100 + dish.discount)) / 100).toLocaleString('vi-VN')}đ
                  </span>
                )} */}
              </div>
            </div>
            <Button
              onClick={() => handleAddCartItem(dish)}
              className="flex flex-row items-center justify-center gap-1 px-4 text-white rounded-full"
            >
              <ShoppingCart size={12} />
              {t('menu.addToCart')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

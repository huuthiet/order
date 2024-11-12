import { SkeletonMenuList } from '@/components/app/skeleton'
import { useDishes } from '@/hooks'
import { Button } from '@/components/ui'

interface IMenuProps {
  isCartOpen: boolean
}

export default function MenuList({ isCartOpen }: IMenuProps) {
  const { data, isLoading } = useDishes()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <SkeletonMenuList key={index} />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <p className="text-center">Không có dữ liệu món ăn</p>
  }

  // const sizes = [
  //   { label: 'S', value: 's' },
  //   { label: 'M', value: 'm' },
  //   { label: 'L', value: 'l' }
  // ]

  return (
    <div className={`grid ${isCartOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-3`}>
      {data.map((dish) => (
        <div key={dish.id} className="flex flex-col bg-white border rounded-xl">
          {/* Image Section - Reduced height */}
          <div className="relative p-2">
            <img src={dish.image} alt={dish.name} className="object-cover w-full h-32 rounded-lg" />
            {/* <div className="absolute flex items-center gap-1 p-0.5 bg-white rounded-lg bottom-3 right-3">
              <Button variant="ghost" size="icon" className="w-5 h-5 hover:bg-gray-100">
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-4 text-xs text-center">1</span>
              <Button variant="ghost" size="icon" className="w-5 h-5 hover:bg-gray-100">
                <Plus className="w-3 h-3" />
              </Button>
            </div> */}
          </div>

          {/* Content Section - More compact */}
          <div className="flex flex-col flex-1 p-4 space-y-1.5">
            <h3 className="text-sm font-medium line-clamp-1">{dish.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{dish.description}</p>

            <div className="flex items-center gap-1.5 mt-auto">
              {/* <span className="text-xs text-gray-600">Size:</span> */}
              <div className="flex">
                {/* {sizes.map((size) => (
                  <button
                    key={size.value}
                    className={cn(
                      'w-5 h-5 rounded-full border text-xs flex items-center justify-center transition-colors',
                      size.value === 's' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    )}
                  >
                    {size.label}
                  </button>
                ))} */}
                {/* <QuantitySelector /> */}
              </div>
            </div>

            <div className="flex items-center justify-between gap-1">
              <span className="text-lg font-bold text-primary">
                {dish.price.toLocaleString('vi-VN')}đ
              </span>
              <Button size="sm" className="px-4 text-xs text-white rounded-full h-7">
                Thêm vào giỏ
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

import { SkeletonCard } from '@/components/app/skeleton'
import { useDishes } from '@/hooks'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { Minus, Plus } from 'lucide-react'

export default function MenuList() {
  const { data, isLoading } = useDishes()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <p className="text-center">Không có dữ liệu món ăn</p>
  }

  const sizes = [
    { label: 'S', value: 's' },
    { label: 'M', value: 'm' },
    { label: 'L', value: 'l' }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((dish) => (
        <div key={dish.id} className="flex overflow-hidden bg-white border rounded-xl">
          <div className="flex flex-col gap-3 w-[200px] p-2">
            <img
              src={dish.image}
              alt={dish.name}
              className="object-cover w-full rounded-lg h-4/5"
            />
            <div className="flex items-center justify-center ">
              <Button
                variant="outline"
                className="p-2 text-gray-600 border rounded-full w-fit h-fit hover:text-gray-800"
              >
                <Minus className="text-xs" />
              </Button>
              <span className="w-8 text-center">1</span>
              <Button
                variant="outline"
                className="p-2 text-gray-600 border rounded-full w-fit h-fit hover:text-gray-800"
              >
                <Plus className="text-xs" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col flex-1 px-2 py-4">
            <h3 className="text-xl font-semibold text-gray-800">{dish.name}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{dish.description}</p>

            <div className="mt-4 text-xl font-bold text-primary">
              {dish.price.toLocaleString('vi-VN')} VND
            </div>

            <div className="flex flex-row items-center gap-4 mt-4">
              <div className="text-sm text-gray-600">Size</div>
              <div className="flex gap-2 mt-1">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    className={cn(
                      'w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-medium transition-colors',
                      size.value === 's' ? 'bg-gray-600 text-white' : 'hover:bg-gray-100'
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end w-full mt-6">
              <Button className="px-6 py-2 w-full text-white rounded-full bg-[#F7941D] hover:bg-[#e88a19]">
                Thêm vào đơn
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

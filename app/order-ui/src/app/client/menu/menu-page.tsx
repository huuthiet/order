import { useState, useEffect } from 'react'
import moment from 'moment'
import { CircleX } from 'lucide-react'

import { usePriceRangeStore, useUserStore } from '@/stores'
import { useSpecificMenu } from '@/hooks'
import { MenuList } from '../menu'
import { CurrentDateInput } from '@/components/app/input'
import { BranchSelect } from '@/components/app/select'
import { PriceRangeFilter } from '@/components/app/popover'

export default function MenuPage() {
  const { userInfo } = useUserStore()
  const { minPrice, maxPrice, clearPriceRange } = usePriceRangeStore()
  const [branch, setBranch] = useState<string>(userInfo?.branch.slug || '')
  const [filters, setFilters] = useState({
    date: moment().format('YYYY-MM-DD'),
    branch,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
  })

  const { data: specificMenu, isLoading } = useSpecificMenu(filters)

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    }))
  }, [minPrice, maxPrice])

  const handleSelectBranch = (value: string) => {
    setBranch(value)
    setFilters((prev) => ({ ...prev, branch: value }))
  }

  const handlePriceRangeFilter = (minPrice: number, maxPrice: number) => {
    // Không cần xử lý thêm vì đã lưu trong store
    console.log(`Price range applied: ${minPrice} - ${maxPrice}`)
  }

  return (
    <div className="container mt-5">
      <div className="flex items-start gap-5">
        <div className="sticky top-10 z-10 w-1/4">
          <div className="flex flex-col gap-4">
            <div className="w-full flex-shrink-0 sm:w-auto">
              <CurrentDateInput menu={specificMenu?.result} />
            </div>
            {minPrice !== 0 && maxPrice !== 0 && (
              <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-primary bg-primary/10 px-2 text-primary">
                <span className="text-xs">{`${minPrice.toLocaleString('vi-VN')}đ`}</span>
                <span className="text-xs">đến</span>
                <span className="text-xs">{`${maxPrice.toLocaleString('vi-VN')}đ`}</span>
                <CircleX onClick={() => clearPriceRange()} />
              </div>
            )}
            <div className="w-full flex-shrink-0 sm:w-auto">
              <BranchSelect onChange={handleSelectBranch} />
            </div>
            <div className="w-full flex-shrink-0 sm:w-auto">
              <PriceRangeFilter onApply={handlePriceRangeFilter} />
            </div>
          </div>
        </div>

        <div className="w-3/4">
          <div className="gap-4">
            <MenuList menu={specificMenu?.result} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

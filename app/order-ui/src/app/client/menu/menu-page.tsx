import { useState, useEffect, useCallback } from 'react'
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

  const handleSelectBranch = useCallback((value: string) => {
    setBranch(value)
    setFilters((prev) => ({ ...prev, branch: value }))
  }, [])

  return (
    <div className="container my-10">
      <div className="flex flex-col items-start gap-5 lg:flex-row">
        {/* Left - sidebar */}
        <div className="w-full lg:sticky lg:top-20 lg:z-10 lg:w-1/4">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex w-full items-center gap-1">
              <CurrentDateInput menu={specificMenu?.result} />
            </div>
            {/* Branch select */}
            <div className="w-full flex-shrink-0 sm:w-auto">
              <BranchSelect onChange={handleSelectBranch} />
            </div>
            {/* Price filter */}
            <div className="w-full flex-shrink-0 sm:w-auto">
              <PriceRangeFilter />
            </div>
            {minPrice !== 0 && maxPrice !== 0 && (
              <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-primary bg-primary/10 px-2 text-primary">
                <span className="text-xs">{`${minPrice.toLocaleString('vi-VN')}đ`}</span>
                <span className="text-xs">đến</span>
                <span className="text-xs">{`${maxPrice.toLocaleString('vi-VN')}đ`}</span>
                <CircleX onClick={() => clearPriceRange()} />
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <MenuList menu={specificMenu?.result} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

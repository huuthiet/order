import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getBranchRevenue } from '@/api'
import { IBranchRevenueQuery } from '@/types'

export const useBranchRevenue = (q: IBranchRevenueQuery) => {
  return useQuery({
    queryKey: ['branchRevenue', JSON.stringify(q)],
    queryFn: () => getBranchRevenue(q),
    placeholderData: keepPreviousData,
  })
}

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getBranchRevenue, getRevenue } from '@/api'
import { IBranchRevenueQuery, IRevenueQuery } from '@/types'

export const useRevenue = (q: IRevenueQuery) => {
  return useQuery({
    queryKey: ['revenue', JSON.stringify(q)],
    queryFn: () => getRevenue(q),
    placeholderData: keepPreviousData,
  })
}

export const useBranchRevenue = (q: IBranchRevenueQuery) => {
  return useQuery({
    queryKey: ['branchRevenue', JSON.stringify(q)],
    queryFn: () => getBranchRevenue(q),
    placeholderData: keepPreviousData,
  })
}

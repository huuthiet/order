import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { logger } from '@/api'

export const useLogger = () => {
  return useQuery({
    queryKey: ['logs'],
    queryFn: () => logger(),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 5, // 5 seconds
    refetchInterval: 1000 * 5 // 5 seconds
  })
}

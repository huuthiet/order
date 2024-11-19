import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { logger } from '@/api'

export const useLogger = () => {
  return useQuery({
    queryKey: ['logs'],
    queryFn: () => logger(),
    placeholderData: keepPreviousData
  })
}

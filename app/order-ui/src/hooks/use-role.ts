import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getRole } from '@/api'

export const useRole = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => getRole(),
    placeholderData: keepPreviousData,
  })
}

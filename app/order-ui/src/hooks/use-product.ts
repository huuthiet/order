import { getAllProducts } from '@/api'
import { useQuery, keepPreviousData } from '@tanstack/react-query'

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getAllProducts(),
    placeholderData: keepPreviousData
  })
}

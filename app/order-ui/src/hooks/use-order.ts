import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { createOrder, getAllOrders, getOrderBySlug } from '@/api'
import { ICreateOrderRequest } from '@/types'

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => getAllOrders(),
    placeholderData: keepPreviousData,
  })
}

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: ICreateOrderRequest) => {
      return createOrder(data)
    },
  })
}

export const useOrderBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['order', slug],
    queryFn: () => getOrderBySlug(slug),
    placeholderData: keepPreviousData,
  })
}

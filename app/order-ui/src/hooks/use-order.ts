import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import {
  createOrder,
  getAllOrders,
  getOrderBySlug,
  initializeQrCode,
} from '@/api'
import { ICreateOrderRequest, IInitateQrCodeRequest } from '@/types'

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

export const useInititateQrCode = () => {
  return useMutation({
    mutationFn: async (data: IInitateQrCodeRequest) => {
      return initializeQrCode(data)
    },
  })
}

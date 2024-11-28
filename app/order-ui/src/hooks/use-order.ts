import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import {
  createOrder,
  createOrderTracking,
  getAllOrders,
  getOrderBySlug,
  initializeQrCode,
} from '@/api'
import {
  ICreateOrderRequest,
  IInitiateQrCodeRequest,
  ICreateOrderTrackingRequest,
} from '@/types'

export const useOrders = (params: {
  ownerSlug?: string
  branchSlug?: string
}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getAllOrders(params),
    placeholderData: keepPreviousData,
  })
}

export const useOrderBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['order', slug],
    queryFn: () => getOrderBySlug(slug),
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

export const useInitiateQrCode = () => {
  return useMutation({
    mutationFn: async (data: IInitiateQrCodeRequest) => {
      return initializeQrCode(data)
    },
  })
}

export const useCreateOrderTracking = () => {
  return useMutation({
    mutationFn: async (data: ICreateOrderTrackingRequest) => {
      return createOrderTracking(data)
    },
  })
}

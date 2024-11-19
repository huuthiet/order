import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { createCatalog, getCatalog, updateCatalog } from '@/api'
import { ICreateCatalogRequest, IUpdateCatalogRequest } from '@/types'

export const useCatalog = () => {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: () => getCatalog(),
    placeholderData: keepPreviousData
  })
}

export const useCreateCatalog = () => {
  return useMutation({
    mutationFn: async (data: ICreateCatalogRequest) => {
      return createCatalog(data)
    }
  })
}

export const useUpdateCatalog = () => {
  return useMutation({
    mutationFn: async (data: IUpdateCatalogRequest) => {
      return updateCatalog(data)
    }
  })
}

import { createSize, deleteSize, getSize, updateSize } from '@/api'
import { ICreateSizeRequest, IUpdateSizeRequest } from '@/types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

export const useSize = () => {
  return useQuery({
    queryKey: ['size'],
    queryFn: () => getSize(),
    placeholderData: keepPreviousData
  })
}

export const useCreateSize = () => {
  return useMutation({
    mutationFn: async (data: ICreateSizeRequest) => {
      return createSize(data)
    }
  })
}

export const useUpdateSize = () => {
  return useMutation({
    mutationFn: async (data: IUpdateSizeRequest) => {
      return updateSize(data)
    }
  })
}

export const useDeleteSize = () => {
  return useMutation({
    mutationFn: async (sizeSlug: string) => {
      return deleteSize(sizeSlug)
    }
  })
}

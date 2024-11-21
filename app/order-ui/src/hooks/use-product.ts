import { createProduct, deleteProduct, getAllProducts, updateProduct } from '@/api'
import { ICreateProductRequest, IUpdateProductRequest } from '@/types'
import { useQuery, keepPreviousData, useMutation } from '@tanstack/react-query'

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getAllProducts(),
    placeholderData: keepPreviousData
  })
}

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (data: ICreateProductRequest) => {
      return createProduct(data)
    }
  })
}

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async (data: IUpdateProductRequest) => {
      return updateProduct(data)
    }
  })
}

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (slug: string) => {
      return deleteProduct(slug)
    }
  })
}

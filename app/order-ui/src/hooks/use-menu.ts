import { createMenu, getAllMenus, getSpecificMenu } from '@/api'
import { ICreateMenuRequest, ISpecificMenuRequest } from '@/types'
import { useQuery, useMutation } from '@tanstack/react-query'

export const useAllMenus = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: async () => getAllMenus(),
  })
}

export const useSpecificMenu = (query: ISpecificMenuRequest) => {
  return useQuery({
    queryKey: ['specific-menu', query],
    queryFn: async () => getSpecificMenu(query),
  })
}

export const useCreateMenu = () => {
  return useMutation({
    mutationFn: async (data: ICreateMenuRequest) => {
      return createMenu(data)
    },
  })
}

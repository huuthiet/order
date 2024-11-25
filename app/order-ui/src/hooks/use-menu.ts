import {
  createMenu,
  updateMenu,
  deleteMenu,
  getAllMenus,
  getSpecificMenu,
  addMenuItem,
} from '@/api'
import {
  IAddMenuItemRequest,
  ICreateMenuRequest,
  ISpecificMenuRequest,
  IUpdateMenuRequest,
} from '@/types'
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

export const useUpdateMenu = () => {
  return useMutation({
    mutationFn: async (data: IUpdateMenuRequest) => {
      return updateMenu(data)
    },
  })
}

export const useDeleteMenu = () => {
  return useMutation({
    mutationFn: async (slug: string) => {
      return deleteMenu(slug)
    },
  })
}

export const useAddMenuItem = () => {
  return useMutation({
    mutationFn: async (data: IAddMenuItemRequest[]) => {
      return addMenuItem(data)
    },
  })
}

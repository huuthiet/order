import {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
  updateTableStatus,
} from '@/api'
import {
  ICreateTableRequest,
  IUpdateTableRequest,
  IUpdateTableStatusRequest,
} from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => getAllTables(),
  })
}

export const useCreateTable = () => {
  return useMutation({
    mutationFn: async (data: ICreateTableRequest) => createTable(data),
  })
}

export const useUpdateTable = () => {
  return useMutation({
    mutationFn: async (data: IUpdateTableRequest) => updateTable(data),
  })
}

export const useDeleteTable = () => {
  return useMutation({
    mutationFn: async (slug: string) => deleteTable(slug),
  })
}

export const useUpdateTableStatus = () => {
  return useMutation({
    mutationFn: async (params: IUpdateTableStatusRequest) =>
      updateTableStatus(params),
  })
}

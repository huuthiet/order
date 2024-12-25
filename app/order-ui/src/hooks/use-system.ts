import {
  createSystemConfig,
  deleteSystemConfigs,
  getSystemConfigs,
  updateSystemConfigs,
} from '@/api'
import { ICreateSystemConfigRequest, IUpdateSystemConfigRequest } from '@/types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

export const useSystemConfigs = () => {
  return useQuery({
    queryKey: ['systemConfigs'],
    queryFn: () => getSystemConfigs(),
    placeholderData: keepPreviousData,
  })
}

export const useCreateSystemConfig = () => {
  return useMutation({
    mutationFn: async (data: ICreateSystemConfigRequest) => {
      return createSystemConfig(data)
    },
  })
}

export const useUpdateSystemConfig = () => {
  return useMutation({
    mutationFn: async (data: IUpdateSystemConfigRequest) => {
      return updateSystemConfigs(data)
    },
  })
}

export const useDeleteSystemConfig = () => {
  return useMutation({
    mutationFn: async (params: { key: string; slug: string }) => {
      return deleteSystemConfigs(params)
    },
  })
}

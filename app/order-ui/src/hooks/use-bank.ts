import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import {
  createBankConnector,
  getBankConnector,
  updateBankConnector,
} from '@/api'
import {
  ICreateBankConnectorRequest,
  IUpdateBankConnectorRequest,
} from '@/types'

export const useGetBankConnector = () => {
  return useQuery({
    queryKey: ['bankConnector'],
    queryFn: () => getBankConnector(),
    placeholderData: keepPreviousData,
  })
}

export const useCreateBankConnector = () => {
  return useMutation({
    mutationFn: async (data: ICreateBankConnectorRequest) => {
      return createBankConnector(data)
    },
  })
}

export const useUpdateBankConnector = () => {
  return useMutation({
    mutationFn: async (data: IUpdateBankConnectorRequest) => {
      return updateBankConnector(data)
    },
  })
}

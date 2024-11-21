import { createBranch, getAllBRanches } from '@/api'
import { ICreateBranchRequest } from '@/types'
import { useQuery, useMutation } from '@tanstack/react-query'

export const useBranch = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => getAllBRanches()
  })
}

export const useCreateBranch = () => {
  return useMutation({
    mutationFn: async (data: ICreateBranchRequest) => {
      return createBranch(data)
    }
  })
}

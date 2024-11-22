import { getProfile, updateProfile } from '@/api'
import { IUpdateProfileRequest } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => getProfile(),
  })
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: IUpdateProfileRequest) => {
      return updateProfile(data)
    },
  })
}

import { getProfile, updateProfile, updatePassword, uploadProfilePicture } from '@/api'
import { IUpdateProfileRequest, IUpdatePasswordRequest } from '@/types'
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

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: IUpdatePasswordRequest) => {
      return updatePassword(data)
    },
  })
}

export const useUploadProfilePicture = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      return uploadProfilePicture(file)
    },
  })
}



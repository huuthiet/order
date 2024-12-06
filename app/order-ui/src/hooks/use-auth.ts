import { forgotPassword, login, register } from '@/api'
import {
  ILoginRequest,
  IRegisterRequest,
  IForgotPasswordRequest,
} from '@/types'
import { useMutation } from '@tanstack/react-query'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: ILoginRequest) => {
      const response = await login(data)
      return response
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: IRegisterRequest) => {
      return register(data)
    },
    onSuccess: () => {
      // After register success, fetch user info
      // queryClient.invalidateQueries({ queryKey: ['user-info-permission'] })
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: IForgotPasswordRequest) => {
      return forgotPassword(email)
    },
  })
}

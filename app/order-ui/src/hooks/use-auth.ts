import {
  forgotPasswordAndGetToken,
  forgotPasswordAndResetPassword,
  login,
  register,
} from '@/api'
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
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: IForgotPasswordRequest) => {
      return forgotPasswordAndGetToken(email)
    },
  })
}

export const useResetPasswordForForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { newPassword: string; token: string }) => {
      return forgotPasswordAndResetPassword(data)
    },
  })
}

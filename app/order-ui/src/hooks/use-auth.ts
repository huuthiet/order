import { login } from '@/api'
import { ILoginRequest } from '@/types'
import { useMutation } from '@tanstack/react-query'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: ILoginRequest) => {
      return login(data)
    },
    onSuccess: () => {
      // After login success, fetch user info
      // queryClient.invalidateQueries({ queryKey: ['user-info-permission'] })
    }
  })
}

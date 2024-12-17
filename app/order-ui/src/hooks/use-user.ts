import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { getUsers, resetPassword, updateUserRole } from '@/api'
import { IQuery } from '@/types'

export const useUsers = (q: IQuery) => {
  return useQuery({
    queryKey: ['users', JSON.stringify(q)],
    queryFn: () => getUsers(q),
    placeholderData: keepPreviousData,
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (user: string) => {
      return resetPassword(user)
    },
  })
}

export const useUpdateUserRole = () => {
  return useMutation({
    mutationFn: async ({ user, role }: { user: string; role: string }) => {
      return updateUserRole(user, role)
    },
  })
}

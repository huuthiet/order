import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { getUsers, resetPassword, updateUserRole } from '@/api'
import { IUserQuery } from '@/types'

export const useUsers = (q: IUserQuery | null) => {
  return useQuery({
    queryKey: ['users', JSON.stringify(q)],
    queryFn: () => (q ? getUsers(q) : Promise.resolve(null)),
    placeholderData: keepPreviousData,
    enabled: !!q,
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

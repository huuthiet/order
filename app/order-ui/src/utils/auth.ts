import { useUserStore } from '@/stores'

export const hasRequiredRole = (role: string) => {
  const { userInfo } = useUserStore.getState()
  if (!userInfo?.role) return false
  return userInfo.role.name === role
}

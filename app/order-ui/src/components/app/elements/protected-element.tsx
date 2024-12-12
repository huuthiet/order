import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ROUTE } from '@/constants'
import { useAuthStore, useUserStore } from '@/stores'
import { useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Role } from '@/constants/role'
import { showToast } from '@/utils'

interface ProtectedElementProps {
  element: ReactNode
  allowedRoles: Role[] // Keep original array type for roles
}

export default function ProtectedElement({
  element,
  allowedRoles,
}: ProtectedElementProps) {
  const { isAuthenticated, setLogout } = useAuthStore()
  const { t } = useTranslation('auth')
  const { removeUserInfo, userInfo } = useUserStore()
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    setLogout()
    removeUserInfo()
    // navigate(ROUTE.LOGIN)
  }, [setLogout, removeUserInfo])

  const hasRequiredPermissions = useCallback(() => {
    if (!userInfo?.role?.name || !allowedRoles) return false

    // Kiểm tra SUPER_ADMIN có quyền truy cập tất cả
    if (userInfo.role.name === Role.SUPER_ADMIN) return true

    console.log(allowedRoles.includes(userInfo.role.name))
    return allowedRoles.includes(userInfo.role.name)
  }, [userInfo, allowedRoles])

  useEffect(() => {
    if (!isAuthenticated()) {
      handleLogout()
      showToast(t('auth:sessionExpired'))
    } else if (!hasRequiredPermissions()) {
      showToast(t('auth:accessDenied'))
      navigate(ROUTE.LOGIN)
    }
  }, [isAuthenticated, navigate, handleLogout, hasRequiredPermissions])

  return hasRequiredPermissions() ? <>{element}</> : null
}

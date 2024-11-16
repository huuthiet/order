import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
// import toast from 'react-hot-toast'
// import { jwtDecode } from 'jwt-decode'
import _ from 'lodash'

import { loginSchema } from '@/schemas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { LoginBackground } from '@/assets/images'
import { LoginForm } from '@/components/app/form'
// import { useLogin, useUser, useUserInfoPermission } from '@/hooks'
// import { IApiResponse, ILoginResponse } from '@/types'
import { useAuthStore } from '@/stores'
import { ROUTE } from '@/constants'
import { showErrorToast, showToast } from '@/utils'
import { cn } from '@/lib/utils'
import { useLogin } from '@/hooks'

export default function Login() {
  const { t } = useTranslation(['auth'])
  //   const { setToken, setRefreshToken, setExpireTime, setExpireTimeRefreshToken, setSlug } =
  //     useAuthStore()
  //   const { getTheme } = useThemeStore()
  const { isAuthenticated } = useAuthStore()

  //   const { setUserRoles } = useUserInfoPermissionsStore()
  //   const { setUserInfo } = useUserStore()
  const navigate = useNavigate()
  const { mutate: login } = useLogin()
  const [isLoading, setIsLoading] = useState(false)
  //   const { refetch: refetchUserInfoPermission } = useUserInfoPermission()
  //   const { refetch: refetchUserInfo } = useUser()

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    try {
      login(data, {
        onSuccess: () => {
          navigate(ROUTE.STAFF_MENU, { replace: true })
          showToast(t('toast.loginSuccess'))
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
              showToast(error.response?.data?.errorCode)
              return
            }
            if (error.code === 'ERR_NETWORK') {
              showErrorToast(error.response?.data?.errorCode)
              return
            }
            showErrorToast(error.response?.data?.statusCode)
          }
        }
      })

      // Save to auth store
      //   const decodedToken = jwtDecode(response.result.token) as { sub: string }
      //   setSlug(decodedToken.sub)
      //   setToken(response.result.token)
      //   setRefreshToken(response.result.refreshToken)
      //   setExpireTime(response.result.expireTime)
      //   setExpireTimeRefreshToken(response.result.expireTimeRefreshToken)

      // Fetch user info and permissions
      //   const { data: userRoles } = await refetchUserInfoPermission()
      //   const { data: userInfo } = await refetchUserInfo()
      //   setUserRoles(Array.isArray(userRoles) ? userRoles : []) // Handle roles being non-array safely
      //   setUserInfo(userInfo as IUserInfo)
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          showToast(error.response?.data?.errorCode)
          return
        }
        if (error.code === 'ERR_NETWORK') {
          showErrorToast(error.response?.data?.errorCode)
          return
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(ROUTE.HOME, { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <img src={LoginBackground} className="absolute top-0 left-0 w-full h-full sm:object-fill" />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Card className="sm:min-w-[24rem] bg-white border border-muted-foreground bg-opacity-10 mx-auto shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className={cn('text-2xl text-center text-white')}>
              {t('login.welcome')}{' '}
            </CardTitle>
            {/* <CardTitle className={cn('text-2xl text-white')}>{t('login.title')} </CardTitle> */}
            <CardDescription className="text-center text-white">
              {' '}
              {t('login.description')}{' '}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

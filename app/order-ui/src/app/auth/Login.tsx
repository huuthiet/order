import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'

import { loginSchema } from '@/schemas'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { LoginBackground } from '@/assets/images'
import { LoginForm } from '@/components/app/form'
import { useAuthStore, useUserStore } from '@/stores'
import { ROUTE } from '@/constants'
import { showErrorToast, showToast } from '@/utils'
import { cn } from '@/lib/utils'
import { useLogin, useProfile } from '@/hooks'

export default function Login() {
  const { t } = useTranslation(['auth'])
  const {
    setToken,
    setRefreshToken,
    setExpireTime,
    setExpireTimeRefreshToken,
  } = useAuthStore()
  //   const { getTheme } = useThemeStore()
  const { isAuthenticated } = useAuthStore()
  const { setUserInfo } = useUserStore()

  const navigate = useNavigate()
  const { mutate: login } = useLogin()
  const { refetch: refetchProfile } = useProfile()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    try {
      login(data, {
        onSuccess: async (response) => {
          setToken(response.result.accessToken)
          setRefreshToken(response.result.refreshToken)
          setExpireTime(response.result.expireTime)
          setExpireTimeRefreshToken(response.result.expireTimeRefreshToken)

          // Fetch profile after successful login
          const profile = await refetchProfile()
          if (profile.data) {
            setUserInfo(profile.data.result)
          }

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
        },
      })
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
      navigate(ROUTE.STAFF_MENU, { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <img
        src={LoginBackground}
        className="absolute top-0 left-0 w-full h-full sm:object-fill"
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Card className="mx-auto border border-muted-foreground bg-white bg-opacity-10 shadow-xl backdrop-blur-xl sm:min-w-[24rem]">
          <CardHeader>
            <CardTitle className={cn('text-center text-2xl text-white')}>
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
          <CardFooter className="flex justify-between gap-1 text-white">
            <div className='flex gap-1'>
              <span className='text-sm'>{t('login.noAccount')}</span>
              <NavLink to={ROUTE.REGISTER} className="text-sm text-center text-primary">
                {t('login.register')}
              </NavLink>
            </div>
            <NavLink to={ROUTE.FORGOT_PASSWORD} className="text-sm text-primary">
              {t('login.forgotPassword')}
            </NavLink>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

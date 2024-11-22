import { useState } from 'react'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { useNavigate, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'

import { registerSchema } from '@/schemas'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui'
import { LoginBackground } from '@/assets/images'
import { RegisterForm } from '@/components/app/form'
// import { useAuthStore } from '@/stores'
import { ROUTE } from '@/constants'
import { showErrorToast, showToast } from '@/utils'
import { cn } from '@/lib/utils'
import { useRegister } from '@/hooks'

export default function Register() {
  const { t } = useTranslation(['auth'])
  //   const { setToken, setRefreshToken, setExpireTime, setExpireTimeRefreshToken, setSlug } =
  //     useAuthStore()
  //   const { getTheme } = useThemeStore()
  // const { isAuthenticated } = useAuthStore()

  const navigate = useNavigate()
  const { mutate: register } = useRegister()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true)
    try {
      register(data, {
        onSuccess: () => {
          navigate(ROUTE.LOGIN, { replace: true })
          showToast(t('toast.registerSuccess'))
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
  // useEffect(() => {
  //   if (isAuthenticated()) {
  //     navigate(ROUTE.STAFF_MENU, { replace: true })
  //   }
  // }, [isAuthenticated, navigate])

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <img src={LoginBackground} className="absolute top-0 left-0 w-full h-full sm:object-fill" />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Card className="sm:min-w-[24rem] bg-white border border-muted-foreground bg-opacity-10 mx-auto shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className={cn('text-2xl text-center text-white')}>
              {t('register.welcome')}{' '}
            </CardTitle>
            {/* <CardTitle className={cn('text-2xl text-white')}>{t('login.title')} </CardTitle> */}
            <CardDescription className="text-center text-white">
              {' '}
              {t('register.description')}{' '}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
          <CardFooter className="flex gap-1 text-white">
            <span>{t('register.haveAccount')}</span>
            <NavLink to={ROUTE.LOGIN} className="text-center text-primary">
              {t('register.login')}
            </NavLink>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

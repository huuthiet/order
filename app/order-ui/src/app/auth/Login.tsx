import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'

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
import { useAuthStore } from '@/stores'
import { ROUTE } from '@/constants'

export default function Login() {
  const { t } = useTranslation(['auth'])
  //   const { getTheme } = useThemeStore()
  const { isAuthenticated } = useAuthStore()

  const navigate = useNavigate()

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
        className="absolute top-0 left-0 object-cover w-full h-full sm:object-fill"
      />

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Card className="border border-muted-foreground bg-white bg-opacity-10 shadow-xl backdrop-blur-xl min-w-[22rem] sm:min-w-[24rem]">
          <CardHeader>
            <CardTitle className='text-2xl text-center text-white'>
              {t('login.welcome')}{' '}
            </CardTitle>
            <CardDescription className="text-center text-white">
              {' '}
              {t('login.description')}{' '}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex justify-between gap-1 text-white">
            <div className='flex gap-1'>
              <span className='text-xs sm:text-sm'>{t('login.noAccount')}</span>
              <NavLink to={ROUTE.REGISTER} className="text-xs text-center sm:text-sm text-primary">
                {t('login.register')}
              </NavLink>
            </div>
            <NavLink to={ROUTE.FORGOT_PASSWORD} className="text-xs sm:text-sm text-primary">
              {t('login.forgotPassword')}
            </NavLink>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

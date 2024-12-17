// import { useState } from 'react'
// import { z } from 'zod'
// import { isAxiosError } from 'axios'
// import { useNavigate, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'

// import { forgotPasswordSchema } from '@/schemas'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui'
import { LoginBackground } from '@/assets/images'
import { ResetPasswordForForgotPasswordForm } from '@/components/app/form'
// import { useAuthStore } from '@/stores'
// import { ROUTE } from '@/constants'
// import { showErrorToast, showToast } from '@/utils'
import { cn } from '@/lib/utils'
// import { useRegister } from '@/hooks'

export default function ForgotPasswordAndResetPassword() {
    const { t } = useTranslation(['auth'])

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            <img src={LoginBackground} className="absolute top-0 left-0 w-full h-full sm:object-fill" />
            <div className="relative z-10 flex items-center justify-center w-full h-full">
                <Card className="sm:min-w-[24rem] bg-white border border-muted-foreground bg-opacity-10 mx-auto shadow-xl backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className={cn('text-2xl text-center text-white')}>
                            {t('forgotPassword.resetPassword')}{' '}
                        </CardTitle>
                        {/* <CardTitle className={cn('text-2xl text-white')}>{t('login.title')} </CardTitle> */}
                        <CardDescription className="text-center text-white">
                            {' '}
                            {t('forgotPassword.description')}{' '}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResetPasswordForForgotPasswordForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

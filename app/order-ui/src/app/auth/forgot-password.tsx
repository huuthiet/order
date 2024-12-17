import { useState } from 'react'
import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui'
import { LoginBackground } from '@/assets/images'
import { ForgotPasswordForm } from '@/components/app/form'
import { cn } from '@/lib/utils'


export default function ForgotPassword() {
    const { t } = useTranslation(['auth'])
    const [isCheckMailOpen, setIsCheckMailOpen] = useState(false)
    const handleSubmit = () => {
        setIsCheckMailOpen(true)
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            <img src={LoginBackground} className="absolute top-0 left-0 w-full h-full sm:object-fill" />
            <div className="relative z-10 flex items-center justify-center w-full h-full">
                {!isCheckMailOpen ? (
                    <Card className="sm:min-w-[24rem] bg-white border border-muted-foreground bg-opacity-10 mx-auto shadow-xl backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className={cn('text-2xl text-center text-white')}>
                                {t('forgotPassword.title')}{' '}
                            </CardTitle>
                            {/* <CardTitle className={cn('text-2xl text-white')}>{t('login.title')} </CardTitle> */}
                            <CardDescription className="text-center text-white">
                                {' '}
                                {t('forgotPassword.description')}{' '}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ForgotPasswordForm onSuccess={handleSubmit} />
                        </CardContent>
                        {/* <CardFooter className="flex gap-1 text-white">
                        <NavLink to={ROUTE.LOGIN} className="text-center text-primary">
                            {t('forgotPassword.back')}
                        </NavLink>
                    </CardFooter> */}
                    </Card>
                ) : (
                    <Card className="sm:w-[32rem] bg-white border border-muted-foreground bg-opacity-10 mx-auto shadow-xl backdrop-blur-xl">
                        <CardHeader className='flex flex-col items-center'>
                            <Mail size={44} className='text-white' />
                            <CardTitle className={cn('text-xl text-center text-white')}>
                                {t('forgotPassword.checkMail')}{' '}
                            </CardTitle>
                            {/* <CardTitle className={cn('text-2xl text-white')}>{t('login.title')} </CardTitle> */}
                            <CardDescription className="text-center text-white">
                                {' '}
                                {/* {t('forgotPassword.checkMailDescription')}{' '} */}
                            </CardDescription>
                        </CardHeader>
                        <CardContent >
                            <div className="flex items-center justify-center text-center text-white">
                                {t('forgotPassword.checkMailDescription')}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

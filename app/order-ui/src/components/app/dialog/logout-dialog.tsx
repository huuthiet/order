import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogOut } from 'lucide-react'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  DialogFooter
} from '@/components/ui'
import { useAuthStore } from '@/stores'
import { showToast } from '@/utils'
import { ROUTE } from '@/constants'

export default function DialogLogout() {
  const { t } = useTranslation(['auth'])
  const { t: tToast } = useTranslation('toast')
  const [isOpen, setIsOpen] = useState(false)
  const { setLogout } = useAuthStore()
  const navigate = useNavigate()
  // const { removeUserInfo, userInfo } = useUserStore()

  const handleLogout = () => {
    setLogout()
    // removeUserInfo()
    // clearUserRoles()
    navigate(ROUTE.LOGIN, { replace: true })
    showToast(tToast('toast.logoutSuccess'))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex justify-start w-full" asChild>
        <Button variant="ghost" className="w-full gap-1 text-sm" onClick={() => setIsOpen(true)}>
          <LogOut className="icon" />
          {t('logout.title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-[18rem] sm:max-w-[28rem] sm:max-h-[32rem] overflow-hidden hover:overflow-y-auto transition-all duration-300">
        <DialogHeader>
          <DialogTitle>{t('logout.title')}</DialogTitle>
          <DialogDescription>{t('logout.description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between gap-2 sm:justify-end">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsOpen(false)}>
            {t('logout.cancel')}
          </Button>
          <Button variant="destructive" className="w-full sm:w-auto" onClick={() => handleLogout()}>
            {t('logout.logout')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusCircledIcon } from '@radix-ui/react-icons'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

import { UpdateProfileForm } from '@/components/app/form'
import { IUserInfo } from '@/types'

interface IUpdateProfileDialogProps {
  userProfile?: IUserInfo
}

export default function UpdateProfileDialog({
  userProfile,
}: IUpdateProfileDialogProps) {
  const { t } = useTranslation(['profile'])
  const [isOpen, setIsOpen] = useState(false)
  const handleSubmit = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 gap-1 text-sm"
          onClick={() => setIsOpen(true)}
        >
          <PlusCircledIcon className="icon" />
          {t('profile.updateProfile')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md px-6 sm:max-w-[56rem]">
        <DialogHeader>
          <DialogTitle>{t('profile.updateProfile')}</DialogTitle>
          <DialogDescription>
            {t('profile.updateProfileDescription')}
          </DialogDescription>
        </DialogHeader>
        <UpdateProfileForm userProfile={userProfile} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

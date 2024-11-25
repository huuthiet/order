import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SquarePen } from 'lucide-react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

interface IUpdateMenuDialogProps {
  menu: IMenu
}

import { UpdateMenuForm } from '@/components/app/form'
import { IMenu } from '@/types'

export default function UpdateMenuDialog({ menu }: IUpdateMenuDialogProps) {
  const { t } = useTranslation(['menu'])
  const [isOpen, setIsOpen] = useState(false)
  const handleSubmit = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="flex justify-start">
        <Button
          variant="ghost"
          className="h-10 gap-1 px-2 text-sm"
          onClick={() => setIsOpen(true)}
        >
          <SquarePen className="icon" />
          {t('menu.update')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('menu.update')}</DialogTitle>
          <DialogDescription>
            {t('menu.updateMenuDescription')}
          </DialogDescription>
        </DialogHeader>
        <UpdateMenuForm menu={menu} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

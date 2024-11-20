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
  DialogTrigger
} from '@/components/ui'

import { UpdateSizeForm } from '@/components/app/form'
import { ISize } from '@/types'

interface DialogUpdateSizeProps {
  size: ISize
}

export default function UpdateSizeDialog({ size }: DialogUpdateSizeProps) {
  const { t } = useTranslation(['product'])
  const [isOpen, setIsOpen] = useState(false)
  const handleSubmit = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="flex justify-start w-full">
        <Button
          variant="ghost"
          className="flex justify-start gap-1 px-2 text-sm"
          onClick={() => setIsOpen(true)}
        >
          <SquarePen className="icon" />
          {t('size.update')}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-md max-w-[20rem] sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('size.update')}</DialogTitle>
          <DialogDescription>{t('size.updateSizeDescription')}</DialogDescription>
        </DialogHeader>
        <UpdateSizeForm size={size} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

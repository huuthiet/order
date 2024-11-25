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
  ScrollArea,
} from '@/components/ui'

import { AddMenuItemForm } from '@/components/app/form'
import { IAddMenuItemRequest } from '@/types'
interface IAddMenuItemDialogProps {
  addMenuItemParams: IAddMenuItemRequest
}

export default function AddMenuItemDialog({
  addMenuItemParams,
}: IAddMenuItemDialogProps) {
  const { t } = useTranslation(['menu'])
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
          {t('menu.addMenuItem')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md px-0 sm:max-w-[44rem]">
        <DialogHeader className="px-6">
          <DialogTitle>{t('menu.addMenuItem')}</DialogTitle>
          <DialogDescription>
            {t('menu.addMenuItemDescription')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[24rem] px-6">
          <AddMenuItemForm
            addMenuItemParams={addMenuItemParams}
            onSubmit={handleSubmit}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

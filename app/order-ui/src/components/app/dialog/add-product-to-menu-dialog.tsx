import { IProduct } from '@/types'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  ScrollArea,
} from '@/components/ui'
import { AddMenuItemForm } from '@/components/app/form'
import { useState } from 'react'
import { PlusCircledIcon } from '@radix-ui/react-icons'

interface AddMenuItemDialogProps {
  product: IProduct
}

export default function AddMenuItemDialog({ product }: AddMenuItemDialogProps) {
  const { t } = useTranslation(['menu'])
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-1 text-sm"
          onClick={() => setIsOpen(true)}
        >
          <PlusCircledIcon className="icon" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md px-0 sm:max-w-[44rem]">
        <DialogHeader className="px-6">
          <DialogTitle>{t('menu.addMenuItem')}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[24rem] px-6">
          <AddMenuItemForm onSubmit={handleSubmit} product={product} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

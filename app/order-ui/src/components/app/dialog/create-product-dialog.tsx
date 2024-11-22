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
  DialogTrigger
} from '@/components/ui'

import { CreateProductForm } from '@/components/app/form'

export default function CreateProductDialog() {
  const { t } = useTranslation(['product'])
  const [isOpen, setIsOpen] = useState(false)
  const handleSubmit = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 gap-1 text-sm" onClick={() => setIsOpen(true)}>
          <PlusCircledIcon className="icon" />
          {t('product.create')}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-md max-w-[20rem] sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('product.create')}</DialogTitle>
          <DialogDescription>{t('product.createProductDescription')}</DialogDescription>
        </DialogHeader>
        <CreateProductForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

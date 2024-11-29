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

import { CreateProductVariantForm } from '@/components/app/form'

export default function CreateProductVariantDialog() {
  const { t } = useTranslation(['product'])
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
          {t('product.createVariant')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md px-6 sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('product.createVariant')}</DialogTitle>
          <DialogDescription>
            {t('product.createVariantDescription')}
          </DialogDescription>
        </DialogHeader>
        <CreateProductVariantForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

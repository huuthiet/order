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

import { UpdateProductForm } from '@/components/app/form'
import { IProduct } from '@/types'

interface DialogUpdateProductProps {
  product: IProduct
}

export default function UpdateProductDialog({
  product,
}: DialogUpdateProductProps) {
  const { t } = useTranslation(['product'])
  const [isOpen, setIsOpen] = useState(false)
  const handleSubmit = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="flex w-full justify-start">
        <Button
          variant="ghost"
          className="flex justify-start gap-1 px-2 text-sm"
          onClick={() => setIsOpen(true)}
        >
          <SquarePen className="icon" />
          {t('product.update')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md px-6 sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('product.update')}</DialogTitle>
          <DialogDescription>
            {t('product.updateProductDescription')}
          </DialogDescription>
        </DialogHeader>
        <UpdateProductForm product={product} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

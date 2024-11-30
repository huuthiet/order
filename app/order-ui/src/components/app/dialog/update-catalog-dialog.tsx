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

import { UpdateCatalogForm } from '@/components/app/form'
import { ICatalog } from '@/types'

interface DialogUpdateCatalogProps {
  catalog: ICatalog
}

export default function UpdateCatalogDialog({
  catalog,
}: DialogUpdateCatalogProps) {
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
          {t('catalog.update')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md px-6 sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('catalog.update')}</DialogTitle>
          <DialogDescription>
            {t('catalog.updateCatalogDescription')}
          </DialogDescription>
        </DialogHeader>
        <UpdateCatalogForm catalog={catalog} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

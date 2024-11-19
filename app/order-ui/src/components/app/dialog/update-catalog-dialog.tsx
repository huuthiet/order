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

import { UpdateCatalogForm } from '@/components/app/form'
import { ICatalog } from '@/types'

interface DialogCreateCatalogProps {
  catalog: ICatalog
}

export default function UpdateCatalogDialog({ catalog }: DialogCreateCatalogProps) {
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
          {t('catalog.update')}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-md max-w-[20rem] sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('catalog.update')}</DialogTitle>
          <DialogDescription>{t('catalog.createCatalogDescription')}</DialogDescription>
        </DialogHeader>
        <UpdateCatalogForm catalog={catalog} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

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

import { CreateCatalogForm } from '@/components/app/form'

export default function CreateCatalogDialog() {
  const { t } = useTranslation(['product'])
  const [isOpen, setIsOpen] = useState(false)
  const handleSubmit = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1 text-sm" onClick={() => setIsOpen(true)}>
          <PlusCircledIcon className="icon" />
          {t('catalog.create')}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-md max-w-[20rem] sm:max-w-[36rem]">
        <DialogHeader>
          <DialogTitle>{t('catalog.create')}</DialogTitle>
          <DialogDescription>{t('catalog.createCatalogDescription')}</DialogDescription>
        </DialogHeader>
        <CreateCatalogForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

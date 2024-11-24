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

import { CreateBankConnectorForm } from '@/components/app/form'
// import { useAllMenus } from '@/hooks'

export default function CreateBankConnectorDialog() {
  const { t } = useTranslation(['bank'])
  const [isOpen, setIsOpen] = useState(false)
  // const { data } = useAllMenus()
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
          {t('bank.create')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md px-0 sm:max-w-[44rem]">
        <DialogHeader className="px-6">
          <DialogTitle>{t('bank.create')}</DialogTitle>
          <DialogDescription>
            {t('bank.createBankConnectorDescription')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[24rem] px-6">
          <CreateBankConnectorForm onSubmit={handleSubmit} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

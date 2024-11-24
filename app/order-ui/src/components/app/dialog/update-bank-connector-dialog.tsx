import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PenSquare } from 'lucide-react'

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

import { UpdateBankConnectorForm } from '@/components/app/form'
import { IBankConnector } from '@/types'
// import { useAllMenus } from '@/hooks'

interface IUpdateBankConnectorDialogProps {
  bankConnector?: IBankConnector
}

export default function UpdateBankConnectorDialog({
  bankConnector,
}: IUpdateBankConnectorDialogProps) {
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
          <PenSquare className="icon" />
          {t('bank.update')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[20rem] rounded-md px-0 sm:max-w-[44rem]">
        <DialogHeader className="px-6">
          <DialogTitle>{t('bank.update')}</DialogTitle>
          <DialogDescription>
            {t('bank.updateBankConnectorDescription')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[24rem] px-6">
          <UpdateBankConnectorForm
            bankConnector={bankConnector}
            onSubmit={handleSubmit}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

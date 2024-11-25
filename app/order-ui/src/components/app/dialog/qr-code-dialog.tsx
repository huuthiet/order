import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'

interface QrCodeDialogProps {
  qrCode: string
}

export default function QrCodeDialog({ qrCode }: QrCodeDialogProps) {
  const { t } = useTranslation(['bank'])
  const [isOpen, setIsOpen] = useState(false)

  // Theo dõi sự thay đổi của qrCode và mở dialog nếu có mã QR mới
  useEffect(() => {
    if (qrCode) {
      setIsOpen(true)
    }
  }, [qrCode])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[18rem] overflow-hidden rounded-lg transition-all duration-300 hover:overflow-y-auto sm:max-h-[32rem] sm:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle>{t('bank.qrCodeTitle')}</DialogTitle>
          <DialogDescription>
            {t('bank.qrCodeTitleDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <img src={qrCode} alt="qr-code" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

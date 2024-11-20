import { useTranslation } from 'react-i18next'
import { Trash2, TriangleAlert } from 'lucide-react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label
} from '@/components/ui'
import { IDish } from '@/types'
import { useState } from 'react'
import { useCartItemStore } from '@/stores'

interface DialogDeleteCartItemProps {
  cartItem: IDish
}

export default function ToppingDialog({ cartItem }: DialogDeleteCartItemProps) {
  const { t } = useTranslation('menu')
  const { t: tCommon } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)
  const { removeCartItem } = useCartItemStore()

  const handleDelete = (itemId: number) => {
    setIsOpen(false)
    removeCartItem(itemId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 size={20} className="text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <TriangleAlert />
            {t('order.deleteItem')}
          </DialogTitle>
          <DialogDescription className="p-2 rounded-md bg-destructive/10 text-destructive">
            {t('order.deleteNote')}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex items-center gap-4 mt-4">
            <Label htmlFor="name" className="text-left">
              {t('order.deleteContent')} <strong>{cartItem.name}</strong>
              {t('order.deleteContent2')}
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {tCommon('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={() => cartItem && handleDelete(cartItem.id)}>
            {tCommon('common.confirmDelete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

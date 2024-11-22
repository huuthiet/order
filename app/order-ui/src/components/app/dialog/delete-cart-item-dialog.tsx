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
  Label,
} from '@/components/ui'
import { ICartItem } from '@/types'
import { useState } from 'react'
import { useCartItemStore } from '@/stores'

interface DialogDeleteCartItemProps {
  cartItem: ICartItem
}

export default function DeleteCartItemDialog({
  cartItem,
}: DialogDeleteCartItemProps) {
  const { t } = useTranslation('menu')
  const { t: tCommon } = useTranslation('common')
  const [isOpen, setIsOpen] = useState(false)
  const { removeCartItem } = useCartItemStore()

  const handleDelete = (id: string) => {
    setIsOpen(false)
    removeCartItem(id)
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
          <DialogDescription className="rounded-md bg-destructive/10 p-2 text-destructive">
            {t('order.deleteNote')}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="mt-4 flex items-center gap-4">
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
          <Button
            variant="destructive"
            onClick={() => cartItem && handleDelete(cartItem.id)}
          >
            {tCommon('common.confirmDelete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

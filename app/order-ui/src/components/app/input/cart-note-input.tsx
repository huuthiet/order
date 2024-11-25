import { NotepadText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ChangeEvent } from 'react'

import { Input } from '@/components/ui'
import { useCartItemStore } from '@/stores'
import { IOrderItem } from '@/types'

interface CartNoteInputProps {
  cartItem: IOrderItem
}

export default function CartNoteInput({ cartItem }: CartNoteInputProps) {
  const { t } = useTranslation('menu')
  const { addNote } = useCartItemStore()

  const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const note = e.target.value
    addNote(cartItem.id, note)
  }

  return (
    <div className="flex w-full flex-row items-center justify-center gap-2.5">
      <div className="flex w-full flex-1 flex-row items-center justify-between gap-2">
        <NotepadText className="text-muted-foreground" />
        <Input
          defaultValue={cartItem?.note || ''}
          type="text"
          placeholder={t('order.enterNote')}
          onChange={handleNoteChange}
        />
      </div>
    </div>
  )
}

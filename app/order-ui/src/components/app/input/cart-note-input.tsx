import { NotepadText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ChangeEvent } from 'react'

import { Input } from '@/components/ui'
import { useCartItemStore } from '@/stores'
import { ICartItem } from '@/types'

interface CartNoteInputProps {
  cartItem: ICartItem
}

export default function CartNoteInput({ cartItem }: CartNoteInputProps) {
  const { t } = useTranslation('menu')
  const { addNote } = useCartItemStore()

  const handleNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const note = e.target.value
    addNote(cartItem.id, note)
  }

  return (
    <div className="flex flex-row justify-center items-center w-full gap-2.5">
      <div className="flex flex-row items-center justify-between flex-1 w-full gap-2">
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

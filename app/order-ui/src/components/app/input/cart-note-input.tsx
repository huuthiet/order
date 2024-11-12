import { Input } from '@/components/ui/input'
import { NotepadText } from 'lucide-react'

export default function CartNoteInput() {
  return (
    <div className="flex flex-row justify-center items-center w-full gap-2.5">
      <div className="flex flex-row items-center justify-between flex-1 w-full gap-2">
        <NotepadText className="text-muted-foreground" />
        <Input type="text" placeholder="Nhập ghi chú" />
      </div>
    </div>
  )
}

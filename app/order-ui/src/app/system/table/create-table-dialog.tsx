import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface CreateTableDialogProps {
  defaultValue: string
  onClose: () => void
  onConfirm: (name: string) => void
}

export default function CreateTableDialog({
  defaultValue,
  onClose,
  onConfirm,
}: CreateTableDialogProps) {
  const [name, setName] = useState(defaultValue)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo bàn mới</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Nhập tên bàn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={() => onConfirm(name)}>Tạo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

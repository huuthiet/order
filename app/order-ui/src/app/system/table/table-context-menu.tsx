import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui'

interface TableContextMenuProps {
  x: number
  y: number
  tableId: string
  onClose: () => void
  onStatusChange: (tableId: string, status: 'available' | 'occupied' | 'reserved') => void
  onDelete: (tableId: string) => void
}

export default function TableContextMenu({
  x,
  y,
  tableId,
  onClose,
  onStatusChange,
  onDelete
}: TableContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white rounded-lg border shadow-lg"
      style={{ left: x, top: y }}
    >
      <div className="p-2 space-y-1">
        <Button
          variant="ghost"
          className="justify-start w-full"
          onClick={() => onStatusChange(tableId, 'available')}
        >
          Đánh dấu trống
        </Button>
        <Button
          variant="ghost"
          className="justify-start w-full"
          onClick={() => onStatusChange(tableId, 'reserved')}
        >
          Đánh dấu đã đặt
        </Button>
        <Button
          variant="ghost"
          className="justify-start w-full"
          onClick={() => onStatusChange(tableId, 'occupied')}
        >
          Đánh dấu đang sử dụng
        </Button>
        <hr />
        <Button
          variant="ghost"
          className="justify-start w-full text-red-500 hover:text-red-600"
          onClick={() => onDelete(tableId)}
        >
          Xóa bàn
        </Button>
      </div>
    </div>
  )
}

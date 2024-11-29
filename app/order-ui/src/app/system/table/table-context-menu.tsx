import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { TableStatus } from '@/constants'

interface TableContextMenuProps {
  open: boolean
  x: number
  y: number
  tableId: string
  onOpenChange: (open: boolean) => void
  onStatusChange: (tableId: string, status: TableStatus) => void
  onDelete: (tableId: string) => void
}

export default function TableContextMenu({
  open,
  x,
  y,
  tableId,
  onOpenChange,
  onStatusChange,
  onDelete,
}: TableContextMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuContent
        className="w-48"
        style={{
          position: 'fixed',
          left: x,
          top: y,
        }}
      >
        <DropdownMenuItem onClick={() => onStatusChange(tableId, TableStatus.AVAILABLE)}>
          Đánh dấu trống
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(tableId, TableStatus.RESERVED)}>
          Đánh dấu đã đặt
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => onDelete(tableId)}
        >
          Xóa bàn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

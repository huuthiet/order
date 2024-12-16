import { DeleteTableDialog, UpdateTableDialog } from '@/components/app/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { TableStatus } from '@/constants'
import { ITable } from '@/types'

interface TableContextMenuProps {
  open: boolean
  x: number
  y: number
  table: ITable | null
  onOpenChange: (open: boolean) => void
  onStatusChange: (tableId: string, status: TableStatus) => void
}

export default function TableContextMenu({
  open,
  x,
  y,
  table,
  onOpenChange,
  onStatusChange,
}: TableContextMenuProps) {
  const handleStatusChange = (status: TableStatus) => {
    if (table) {
      onStatusChange(table.slug, status)
      onOpenChange(false)
    }
  }

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
        <DropdownMenuItem
          onClick={() => handleStatusChange(TableStatus.AVAILABLE)}
        >
          Đánh dấu trống
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange(TableStatus.RESERVED)}
        >
          Đánh dấu đã đặt
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <UpdateTableDialog table={table} />
        <DeleteTableDialog
          table={table}
          onContextOpen={() => onOpenChange(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

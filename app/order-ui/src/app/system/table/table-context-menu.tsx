import { DeleteTableDialog } from "@/components/app/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { TableStatus } from '@/constants'
import { ITable } from "@/types"

interface TableContextMenuProps {
  open: boolean
  x: number
  y: number
  table: ITable | null
  onOpenChange: (open: boolean) => void
  onStatusChange: (tableId: string, status: TableStatus) => void
  onDelete: (tableId: string) => void
}

export default function TableContextMenu({
  open,
  x,
  y,
  table,
  onOpenChange,
  onStatusChange,
  // onDelete,
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
        <DropdownMenuItem onClick={() => table && onStatusChange(table.slug, TableStatus.AVAILABLE)}>
          Đánh dấu trống
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => table && onStatusChange(table.slug, TableStatus.RESERVED)}>
          Đánh dấu đã đặt
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteTableDialog
          table={table}
          onContextOpen={() => onOpenChange(false)}
        // onDialogOpen={() => onOpenChange(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

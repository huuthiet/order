import { useState, CSSProperties } from 'react'
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Table } from '@/types'
import TableContextMenu from './table-context-menu'

interface DraggableTableProps {
  table: Table
  onDragEnd: (event: DragEndEvent) => void
}

function DraggableTable({ table }: DraggableTableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: table.id,
    data: table
  })

  const style: CSSProperties = {
    position: 'absolute' as const,
    left: table.x,
    top: table.y,
    width: table.width,
    height: table.height,
    transform: transform ? CSS.Translate.toString(transform) : undefined
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`draggable-table cursor-move rounded-lg border-2 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow
        ${
          table.status === 'available'
            ? 'bg-green-100 border-green-500'
            : table.status === 'occupied'
              ? 'bg-red-100 border-red-500'
              : 'bg-yellow-100 border-yellow-500'
        }
      `}
    >
      <span className="font-medium select-none">{table.name}</span>
    </div>
  )
}

export default function TableLayout() {
  const [tables, setTables] = useState<Table[]>([])
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    tableId: string
  } | null>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const tableId = active.id as string

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            x: table.x + delta.x,
            y: table.y + delta.y
          }
        }
        return table
      })
    )
  }

  const handleContextMenu = (event: React.MouseEvent, tableId: string) => {
    event.preventDefault()
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      tableId
    })
  }

  const handleStatusChange = (tableId: string, status: Table['status']) => {
    setTables((prev) =>
      prev.map((table) => {
        if (table.id === tableId) {
          return { ...table, status }
        }
        return table
      })
    )
    setContextMenu(null)
  }

  const handleDeleteTable = (tableId: string) => {
    setTables((prev) => prev.filter((table) => table.id !== tableId))
    setContextMenu(null)
  }

  const handleAddTable = (event: React.MouseEvent<HTMLDivElement>) => {
    // Kiểm tra nếu click vào bàn đã có thì không thêm bàn mới
    const target = event.target as HTMLElement
    if (target.closest('.draggable-table')) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const newTable: Table = {
      id: `table-${tables.length + 1}`,
      name: `Bàn ${tables.length + 1}`,
      x: event.clientX - rect.left - 50,
      y: event.clientY - rect.top - 50,
      width: 100,
      height: 100,
      status: 'available'
    }
    setTables([...tables, newTable])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Sơ đồ bàn</h1>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded" />
              <span className="text-sm">Trống</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded" />
              <span className="text-sm">Đã đặt</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded" />
              <span className="text-sm">Đang sử dụng</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Click vào bất kỳ đâu để thêm bàn mới</div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="relative flex-1 bg-gray-50 floor-plan cursor-crosshair"
          onClick={handleAddTable}
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] grid-rows-[repeat(auto-fill,minmax(50px,1fr))] opacity-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-gray-300" />
            ))}
          </div>

          {/* Tables */}
          {tables.map((table) => (
            <div key={table.id} onContextMenu={(e) => handleContextMenu(e, table.id)}>
              <DraggableTable table={table} onDragEnd={handleDragEnd} />
            </div>
          ))}
        </div>
      </DndContext>

      {contextMenu && (
        <TableContextMenu
          {...contextMenu}
          onClose={() => setContextMenu(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteTable}
        />
      )}
    </div>
  )
}

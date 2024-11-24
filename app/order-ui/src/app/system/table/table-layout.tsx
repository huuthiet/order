import { useState, CSSProperties, useRef, useCallback } from 'react'
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Table } from '@/types'
import TableContextMenu from './table-context-menu'
import { useCreateTable } from '@/hooks/use-table'
import { showToast } from '@/utils'
import CreateTableDialog from './create-table-dialog'

interface DraggableTableProps {
  table: Table
  onDragEnd: (event: DragEndEvent) => void
}

function DraggableTable({ table }: DraggableTableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: table.id,
    data: table,
  })

  const style: CSSProperties = {
    position: 'absolute' as const,
    left: table.x,
    top: table.y,
    width: table.width,
    height: table.height,
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transformOrigin: '0 0',
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`draggable-table flex cursor-move items-center justify-center rounded-lg border-2 shadow-md transition-shadow hover:shadow-lg ${
        table.status === 'available'
          ? 'border-green-500 bg-green-100'
          : table.status === 'occupied'
            ? 'border-red-500 bg-red-100'
            : 'border-yellow-500 bg-yellow-100'
      } `}
    >
      <span className="select-none font-medium">{table.name}</span>
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
  const [newTablePosition, setNewTablePosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const isDraggingRef = useRef(false)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const createTableMutation = useCreateTable()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const tableId = active.id as string

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            x: table.x + delta.x,
            y: table.y + delta.y,
          }
        }
        return table
      }),
    )
  }

  const handleContextMenu = (event: React.MouseEvent, tableId: string) => {
    event.preventDefault()
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      tableId,
    })
  }

  const handleStatusChange = (tableId: string, status: Table['status']) => {
    setTables((prev) =>
      prev.map((table) => {
        if (table.id === tableId) {
          return { ...table, status }
        }
        return table
      }),
    )
    setContextMenu(null)
  }

  const handleDeleteTable = (tableId: string) => {
    setTables((prev) => prev.filter((table) => table.id !== tableId))
    setContextMenu(null)
  }

  const handleAddTable = async (event: React.MouseEvent<HTMLDivElement>) => {
    // Kiểm tra nếu click vào bàn đã có thì không thêm bàn mới
    const target = event.target as HTMLElement
    if (target.closest('.draggable-table')) {
      return
    }

    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    // Adjust position based on current transform
    setNewTablePosition({
      x: (event.clientX - rect.left - transform.x) / transform.scale - 50,
      y: (event.clientY - rect.top - transform.y) / transform.scale - 50,
    })
  }

  const handleCreateTable = async (name: string) => {
    if (!newTablePosition) return

    const tableNumber = tables.length + 1
    const newTable: Table = {
      id: `table-${tableNumber}`,
      name,
      x: newTablePosition.x,
      y: newTablePosition.y,
      width: 100,
      height: 100,
      status: 'available',
    }

    try {
      await createTableMutation.mutateAsync({
        name,
        branch: '3Izagl2f4',
        location: `table-location-${tableNumber}`,
      })

      setTables([...tables, newTable])
      showToast('toast.createTableSuccess')
    } catch (error) {
      showToast('Tạo bàn thất bại')
    }
    setNewTablePosition(null)
  }

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY
      const scaleChange = delta > 0 ? 0.9 : 1.1
      const newScale = Math.min(Math.max(transform.scale * scaleChange, 0.1), 5)

      setTransform((prev) => ({
        ...prev,
        scale: newScale,
      }))
    },
    [transform.scale],
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start panning if clicking on empty space
    if ((e.target as HTMLElement).closest('.draggable-table')) return
    if (newTablePosition) return

    isDraggingRef.current = true
    lastPositionRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return

    const deltaX = e.clientX - lastPositionRef.current.x
    const deltaY = e.clientY - lastPositionRef.current.y

    setTransform((prev) => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }))

    lastPositionRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Sơ đồ bàn</h1>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded border-2 border-green-500 bg-green-100" />
              <span className="text-sm">Trống</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded border-2 border-red-500 bg-red-100" />
              <span className="text-sm">Đã đặt</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 rounded border-2 border-yellow-500 bg-yellow-100" />
              <span className="text-sm">Đang sử dụng</span>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Click vào bất kỳ đâu để thêm bàn mới
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div
          ref={containerRef}
          className="floor-plan relative flex-1 cursor-grab overflow-hidden bg-gray-50 active:cursor-grabbing"
          onClick={handleAddTable}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            }}
          >
            {/* Grid background */}
            <div className="absolute inset-0 grid grid-cols-[repeat(100,50px)] grid-rows-[repeat(100,50px)] opacity-10">
              {Array.from({ length: 10000 }).map((_, i) => (
                <div key={i} className="border border-gray-300" />
              ))}
            </div>

            {/* Tables */}
            {tables.map((table) => (
              <div
                key={table.id}
                onContextMenu={(e) => handleContextMenu(e, table.id)}
              >
                <DraggableTable table={table} onDragEnd={handleDragEnd} />
              </div>
            ))}
          </div>
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

      {newTablePosition && (
        <CreateTableDialog
          defaultValue={`Bàn ${tables.length + 1}`}
          onClose={() => setNewTablePosition(null)}
          onConfirm={handleCreateTable}
        />
      )}
    </div>
  )
}

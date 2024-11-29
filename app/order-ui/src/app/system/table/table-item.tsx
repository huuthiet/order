import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ITable } from '@/types'
import { TableStatus } from '@/constants'

interface TableItemProps {
  table: ITable
  position?: { x: number; y: number }
  onContextMenu: (e: React.MouseEvent) => void
}

export function TableItem({ table, position, onContextMenu }: TableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: table.slug,
  })

  const xPos = position?.x ?? table.xPosition ?? 0
  const yPos = position?.y ?? table.yPosition ?? 0

  const style = {
    ...(transform ? { transform: CSS.Translate.toString(transform) } : {}),
    left: `${xPos}px`,
    top: `${yPos}px`
  }

  return (
    <div ref={setNodeRef} {...listeners}
      {...attributes} style={style} className='absolute flex flex-col' onContextMenu={onContextMenu}>
      {/* <div className='w-20 h-4 border rounded-full' /> */}
      <div
        className={`absolute flex flex-col ${table.status === TableStatus.RESERVED ? 'border bg-red-100 border-red-500' : 'border bg-green-100 border-green-500'} items-center justify-center w-20 h-20  rounded-md shadow cursor-move`}
      >
        <span className="text-sm font-medium">{table.name}</span>
      </div>
    </div>
  )
}

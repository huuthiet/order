import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ITable } from '@/types'
import { TableStatus } from '@/constants'

interface TableItemProps {
  table: ITable
  position?: { x: number; y: number }
  onContextMenu: (e: React.MouseEvent) => void
  isSelected?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export function TableItem({
  table,
  position,
  onContextMenu,
  isSelected,
  onClick,
}: TableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: table.slug,
  })

  const xPos = position?.x ?? table.xPosition ?? 0
  const yPos = position?.y ?? table.yPosition ?? 0

  const style = {
    ...(transform ? { transform: CSS.Translate.toString(transform) } : {}),
    left: `${xPos}px`,
    top: `${yPos}px`,
    transition: 'all 0.2s ease-in-out',
  }

  const getStatusColor = () => {
    switch (table.status) {
      case TableStatus.AVAILABLE:
        return 'bg-green-100 border-green-500'
      case TableStatus.RESERVED:
        return 'border-yellow-500'
      default:
        return 'border-gray-500'
    }
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="absolute"
      onContextMenu={onContextMenu}
      onClick={onClick}
    >
      <div
        className={`flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border-2 ${getStatusColor()} ${isSelected
          ? 'z-10 scale-110 border-primary bg-primary/10 ring-4 ring-primary'
          : 'bg-background hover:ring-2 hover:ring-primary/50'
          } transition-all duration-200`}
      >
        <span
          className={`text-sm font-medium`}
        >
          {table.name}
        </span>
      </div>
    </div>
  )
}

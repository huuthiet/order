// import { Handle, Position } from '@xyflow/react'

interface TableNodeProps {
  id: string
  data: {
    name: string
    status: 'available' | 'occupied' | 'reserved' | string
    onContextMenu: (event: React.MouseEvent, tableId: string) => void
  }
}

export default function TableNode({ id, data }: TableNodeProps) {
  const getStatusColor = () => {
    switch (data.status) {
      case 'available':
        return 'border-green-500 bg-green-100'
      case 'occupied':
        return 'border-red-500 bg-red-100'
      case 'reserved':
        return 'border-yellow-500 bg-yellow-100'
      default:
        return 'border-gray-500 bg-gray-50'
    }
  }

  return (
    <div
      className={`drag-handle flex h-20 w-20 items-center justify-center rounded-lg border-2 shadow-md ${getStatusColor()}`}
      onContextMenu={(e) => data.onContextMenu(e, id)}
    >
      <div className="text-center">
        <span className="text-sm font-medium">{data.name}</span>
      </div>
    </div>
  )
}

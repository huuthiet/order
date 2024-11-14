export interface Table {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  status: 'available' | 'occupied' | 'reserved'
}

export interface TableContextMenu {
  x: number
  y: number
  tableId: string
}

export interface TableLayoutProps {
  onTableStatusChange?: (tableId: string, status: Table['status']) => void
  onTablePositionChange?: (tableId: string, x: number, y: number) => void
}

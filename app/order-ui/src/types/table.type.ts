import { IBase } from './base.type'

export interface Table {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  status: 'available' | 'occupied' | 'reserved'
}

export interface ITable extends IBase {
  name: string
  location: string
  isEmpty: boolean
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

export interface ICreateTableRequest {
  name: string
  branch: string // Branch slug
  location: string
}

export interface IUpdateTableRequest {
  slug: string
  name: string
  location: string
}

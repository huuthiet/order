import { IOrderDetail, IOrder, OrderStatus } from './dish.type'

export interface IOrderStore {
  order: IOrder | null
  // selectedItems: IOrderDetail[]

  getOrder: () => IOrder | null
  addOrder: (order: IOrder) => void
  removeOrder: () => void

  // getSelectedItems: () => IOrderDetail[]
  // isItemSelected: (orderId: string, itemIndex: number) => boolean
  // addSelectedItem: (item: IOrderDetail) => void
  // removeSelectedItem: (itemId: string) => void
  // clearSelectedItems: () => void
}

export interface IOrderTrackingStore {
  selectedItems: IOrderDetail[]
  getSelectedItems: () => IOrderDetail[]
  isItemSelected: (orderId: string, itemIndex: number) => boolean
  addSelectedItem: (item: IOrderDetail) => void
  removeSelectedItem: (itemId: string) => void
  clearSelectedItems: () => void
}

export interface IOrdersQuery {
  ownerSlug?: string
  branchSlug?: string
  page: number | 1
  size: number | 10
  order: 'ASC' | 'DESC'
  status?: OrderStatus[] // No changes needed here
  table?: string
  hasPaging?: boolean
  enabled?: boolean
}

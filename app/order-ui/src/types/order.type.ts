import { IOrderDetail } from './dish.type'

export interface IOrderStore {
  order: IOrderDetail | null
  selectedItems: IOrderDetail[]

  getOrder: () => IOrderDetail | null
  addOrder: (order: IOrderDetail) => void
  removeOrder: () => void

  getSelectedItems: () => IOrderDetail[]
  isItemSelected: (orderId: string, itemIndex: number) => boolean
  addSelectedItem: (item: IOrderDetail) => void
  removeSelectedItem: (itemId: string) => void
  clearSelectedItems: () => void
}

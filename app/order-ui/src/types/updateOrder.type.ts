import { ICartItem, IOrder, IOrderToUpdate, IOrderType, ITable } from '@/types'

export interface IUpdateOrderStore {
  orderItems: IOrderToUpdate | null
  getOrderItems: () => IOrderToUpdate | null
  setOrderItems: (order: IOrder) => void
  addOrderItem: (item: ICartItem) => void
  updateOrderItemQuantity: (id: string, quantity: number) => void
  addNote: (id: string, note: string) => void
  addOrderType: (orderType: IOrderType) => void
  addTable: (table: ITable) => void
  removeTable: () => void
  addPaymentMethod: (paymentMethod: string) => void
  removeOrderItem: (cartItemId: string) => void
  // clearCart: () => void
}

import { ICartItem, IOrderType, ITable } from '@/types'

export interface ICartItemStore {
  cartItems: ICartItem | null
  getCartItems: () => ICartItem | null
  addCustomerInfo: (owner: string) => void
  addCartItem: (item: ICartItem) => void
  updateCartItemQuantity: (id: string, quantity: number) => void
  addNote: (id: string, note: string) => void
  addOrderType: (orderType: IOrderType) => void
  addTable: (table: ITable) => void
  removeTable: () => void
  addPaymentMethod: (paymentMethod: string) => void
  removeCartItem: (cartItemId: string) => void
  clearCart: () => void
}

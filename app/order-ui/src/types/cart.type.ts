import { ICartItem } from '@/types'

export interface ICartItemStore {
  cartItems: ICartItem[]
  getCartItems: () => ICartItem[]
  addCartItem: (item: ICartItem) => void
  updateCartItemQuantity: (id: string, quantity: number) => void
  addNote: (id: string, note: string) => void
  addPaymentMethod: (paymentMethod: string) => void
  removeCartItem: (id: string) => void
  clearCart: () => void
}

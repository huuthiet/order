import { IDish } from './dish.type'

interface CartItem extends IDish {
  quantity: number
}

export interface ICartItemStore {
  cartItems: CartItem[]
  getCartItems: () => CartItem[]
  addCartItem: (item: IDish) => void
  updateCartItemQuantity: (id: number, quantity: number) => void
  addNote: (id: number, note: string) => void
  removeCartItem: (id: number) => void
  clearCart: () => void
}

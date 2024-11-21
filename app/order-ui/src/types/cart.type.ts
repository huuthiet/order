import { IProduct, IProductVariant } from '@/types'

interface CartItem extends IProduct {
  quantity: number
  selectedVariant?: IProductVariant // Add this line
  note?: string
}

export interface ICartItemStore {
  cartItems: CartItem[]
  getCartItems: () => CartItem[]
  addCartItem: (item: IProduct) => void
  updateCartItemQuantity: (id: string, quantity: number) => void
  addNote: (id: string, note: string) => void
  addPaymentMethod: (paymentMethod: string) => void
  removeCartItem: (id: string) => void
  clearCart: () => void
}

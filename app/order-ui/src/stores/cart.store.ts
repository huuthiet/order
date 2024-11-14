import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18next from 'i18next'

import { showToast, showErrorToast } from '@/utils'
import { ICartItemStore, IDish } from '@/types'

export const useCartItemStore = create<ICartItemStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      getCartItems: () => get().cartItems,
      addCartItem: (item: IDish) => {
        const { cartItems } = get()
        const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)
        if (existingItem) {
          showErrorToast(1000)
          return
        }
        set({
          cartItems: [...cartItems, { ...item, quantity: 1 }]
        })
        showToast(i18next.t('toast.addSuccess'))
      },
      updateCartItemQuantity: (id: number, quantity: number) => {
        const { cartItems } = get()
        set({
          cartItems: cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        })
      },
      addNote: (id: number, note: string) => {
        const { cartItems } = get()
        set({
          cartItems: cartItems.map((item) => (item.id === id ? { ...item, note } : item))
        })
      },
      removeCartItem: (id: number) => {
        const { cartItems } = get()
        set({
          cartItems: cartItems.filter((item) => item.id !== id)
        })
        showToast(i18next.t('toast.removeSuccess'))
      },
      clearCart: () => {
        set({ cartItems: [] })
        showToast(i18next.t('toast.clearSuccess'))
      }
    }),
    {
      name: 'cart-store'
    }
  )
)

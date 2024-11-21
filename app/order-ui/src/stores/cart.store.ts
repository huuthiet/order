import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18next from 'i18next'

import { showToast } from '@/utils'
import { ICartItemStore, ICartItem } from '@/types'

export const useCartItemStore = create<ICartItemStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      getCartItems: () => get().cartItems,
      addCartItem: (item: ICartItem) => {
        const { cartItems } = get()
        // const existingItem = cartItems.find((cartItem) => cartItem.slug === item.slug)
        // const existingItem = cartItems.find((cartItem) =>
        //   cartItem.slug === item.slug &&
        //   cartItem.selectedVariant?.slug === item.selectedVariant?.slug
        // )

        // if (existingItem) {
        //   showErrorToast(1000)
        //   return
        // }
        set({
          cartItems: [...cartItems, { ...item, quantity: 1 }],
        })
        showToast(i18next.t('toast.addSuccess'))
      },

      //   if (existingItem) {
      //     set({
      //       cartItems: cartItems.map((cartItem) =>
      //         cartItem.slug === item.slug &&
      //         cartItem.selectedVariant?.slug === item.selectedVariant?.slug
      //           ? { ...cartItem, quantity: cartItem.quantity + 1 }
      //           : cartItem
      //       ),
      //     })
      //   } else {
      //     set({ cartItems: [...cartItems, item] })
      //   }
      // },
      updateCartItemQuantity: (slug: string, quantity: number) => {
        const { cartItems } = get()
        set({
          cartItems: cartItems.map((item) =>
            item.slug === slug ? { ...item, quantity } : item,
          ),
        })
      },
      addNote: (slug: string, note: string) => {
        const { cartItems } = get()
        set({
          cartItems: cartItems.map((item) =>
            item.slug === slug ? { ...item, note } : item,
          ),
        })
      },
      addPaymentMethod: (paymentMethod: string) => {
        const { cartItems } = get()
        set({
          cartItems: cartItems.map((item) => ({ ...item, paymentMethod })),
        })
      },
      removeCartItem: (slug: string) => {
        const { cartItems } = get()
        set({
          cartItems: cartItems.filter((item) => item.slug !== slug),
        })
        showToast(i18next.t('toast.removeSuccess'))
      },
      clearCart: () => {
        set({ cartItems: [] })
        showToast(i18next.t('toast.clearSuccess'))
      },
    }),
    {
      name: 'cart-store',
    },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18next from 'i18next'

import { showToast } from '@/utils'
import { ICartItemStore, ICartItem } from '@/types'

export const useCartItemStore = create<ICartItemStore>()(
  persist(
    (set, get) => ({
      cartItems: null, // Chỉ lưu một cart item hoặc null nếu không có item nào

      getCartItems: () => get().cartItems,

      addCustomerInfo: (owner: string) => {
        const { cartItems } = get()
        if (cartItems) {
          set({
            cartItems: { ...cartItems, owner }, // Cập nhật owner cho cartItems
          })
        }
      },

      addCartItem: (item: ICartItem) => {
        // Lưu duy nhất một cart item vào cartItems
        set({
          cartItems: item, // Lưu trực tiếp item vào cartItems
        })
        showToast(i18next.t('toast.addSuccess'))
      },

      updateCartItemQuantity: (id: string, quantity: number) => {
        const { cartItems } = get()
        if (cartItems) {
          const updatedOrderItems = cartItems.orderItems.map((orderItem) =>
            orderItem.id === id ? { ...orderItem, quantity } : orderItem,
          )

          set({
            cartItems: {
              ...cartItems,
              orderItems: updatedOrderItems,
            },
          })
        }
      },

      addNote: (id: string, note: string) => {
        const { cartItems } = get()
        if (cartItems) {
          const updatedOrderItems = cartItems.orderItems.map((orderItem) =>
            orderItem.id === id ? { ...orderItem, note } : orderItem,
          )

          set({
            cartItems: {
              ...cartItems,
              orderItems: updatedOrderItems,
            },
          })
        }
      },

      addTable: (table: string) => {
        const { cartItems } = get()
        if (cartItems) {
          set({
            cartItems: { ...cartItems, table },
          })
        }
      },

      addPaymentMethod: () => {
        const { cartItems } = get()
        if (cartItems) {
          set({
            cartItems: { ...cartItems },
          })
        }
      },

      removeCartItem: (cartItemId: string) => {
        const { cartItems } = get()

        if (cartItems) {
          // Lọc bỏ orderItem có id trùng với orderItemId
          const updatedOrderItems = cartItems.orderItems.filter(
            (orderItem) => orderItem.id !== cartItemId,
          )

          // Cập nhật lại cartItems với orderItems đã thay đổi
          set({
            cartItems: {
              ...cartItems,
              orderItems: updatedOrderItems,
            },
          })
          showToast(i18next.t('toast.removeSuccess'))
        }
      },

      clearCart: () => {
        set({ cartItems: null }) // Xóa cartItems
        // showToast(i18next.t('toast.clearSuccess'))
      },
    }),
    {
      name: 'cart-store',
    },
  ),
)

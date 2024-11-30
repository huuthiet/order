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
        const { cartItems } = get()
        if (!cartItems) {
          // If cart is empty, create new cart with the item
          set({ cartItems: item })
        } else {
          // Check if item already exists in cart
          const existingItemIndex = cartItems.orderItems.findIndex(
            (orderItem) => orderItem.id === item.orderItems[0].id,
          )

          if (existingItemIndex >= 0) {
            // If item exists, increase its quantity
            const updatedOrderItems = [...cartItems.orderItems]
            updatedOrderItems[existingItemIndex].quantity +=
              item.orderItems[0].quantity

            set({
              cartItems: {
                ...cartItems,
                orderItems: updatedOrderItems,
              },
            })
          } else {
            // If item doesn't exist, add it to the array
            set({
              cartItems: {
                ...cartItems,
                orderItems: [...cartItems.orderItems, ...item.orderItems],
              },
            })
          }
        }
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
        console.log('Remove cart item', cartItemId)
        if (cartItems) {
          const itemToRemove = cartItems.orderItems.find(
            (item) => item.id === cartItemId,
          )
          console.log('Item to remove', itemToRemove)
          if (itemToRemove && itemToRemove.quantity > 1) {
            // If quantity > 1, decrease quantity by 1
            const updatedOrderItems = cartItems.orderItems.map((orderItem) =>
              orderItem.id === cartItemId
                ? { ...orderItem, quantity: orderItem.quantity - 1 }
                : orderItem,
            )
            set({
              cartItems: {
                ...cartItems,
                orderItems: updatedOrderItems,
              },
            })
          } else {
            // If quantity is 1, remove the item completely
            const updatedOrderItems = cartItems.orderItems.filter(
              (orderItem) => orderItem.id !== cartItemId,
            )
            set({
              cartItems: {
                ...cartItems,
                orderItems: updatedOrderItems,
              },
            })
          }
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

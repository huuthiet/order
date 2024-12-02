import { IOrder, IOrderDetail, IOrderStore, IOrderTrackingStore } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOrderStore = create<IOrderStore>()(
  persist(
    (set, get) => ({
      order: null,

      getOrder: () => get().order,

      addOrder: (orderInfo: IOrder) => {
        console.log('Updating order in store:', orderInfo)

        set((state) => ({
          ...state,
          order: orderInfo,
        }))
      },

      removeOrder: () => {
        set((state) => ({
          ...state,
          order: null,
        }))
      },
    }),
    {
      name: 'order-store',
    },
  ),
)

export const useOrderTrackingStore = create<IOrderTrackingStore>()(
  persist(
    (set, get) => ({
      selectedItems: [],

      getSelectedItems: () => get().selectedItems,

      isItemSelected: (orderId: string, itemIndex: number) => {
        const selectedItems = get().selectedItems
        const selectedItem = selectedItems.find((item) => item.slug === orderId)

        if (!selectedItem) return false

        return itemIndex < selectedItem.quantity
      },

      addSelectedItem: (item: IOrderDetail) => {
        const currentItems = get().selectedItems
        const existingItem = currentItems.find(
          (existing) => existing.slug === item.slug,
        )

        if (existingItem) {
          set({
            selectedItems: currentItems.map((existing) =>
              existing.slug === item.slug
                ? {
                    ...existing,
                    quantity: existing.quantity + 1,
                    subtotal: existing.variant.price * (existing.quantity + 1),
                  }
                : existing,
            ),
          })
        } else {
          set({
            selectedItems: [
              ...currentItems,
              {
                ...item,
                quantity: 1,
                subtotal: item.variant.price,
                slug: item.slug,
              },
            ],
          })
        }
      },

      removeSelectedItem: (itemId: string) => {
        console.log('Removing item:', itemId)
        const currentItems = get().selectedItems
        console.log('Current items:', currentItems)
        const [orderId] = itemId.split('-')
        console.log('Order ID:', orderId)

        set({
          selectedItems: currentItems
            .map((item) => {
              if (item.slug === orderId) {
                console.log('Found item:', item)
                const newQuantity = item.quantity - 1
                if (newQuantity === 0) return null
                return {
                  ...item,
                  quantity: newQuantity,
                  subtotal: item.variant.price * newQuantity,
                }
              }
              return item
            })
            .filter((item): item is IOrderDetail => item !== null),
        })
      },

      clearSelectedItems: () => {
        set({ selectedItems: [] })
      },
    }),
    {
      name: 'order-tracking-store',
    },
  ),
)

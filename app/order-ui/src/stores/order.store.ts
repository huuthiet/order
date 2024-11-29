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

      // getSelectedItems: () => get().selectedItems,

      // isItemSelected: (orderId: string, itemIndex: number) => {
      //   const selectedItems = get().selectedItems
      //   const selectedItem = selectedItems.find((item) => item.slug === orderId)

      //   if (!selectedItem) return false

      //   return itemIndex < selectedItem.quantity
      // },

      // addSelectedItem: (item: IOrderDetail) => {
      //   const currentItems = get().selectedItems
      //   const existingItem = currentItems.find(
      //     (existing) => existing.slug === item.slug,
      //   )

      //   if (existingItem) {
      //     set({
      //       selectedItems: currentItems.map((existing) =>
      //         existing.slug === item.slug
      //           ? {
      //               ...existing,
      //               quantity: existing.quantity + 1,
      //               subtotal: existing.variant.price * (existing.quantity + 1),
      //             }
      //           : existing,
      //       ),
      //     })
      //   } else {
      //     set({
      //       selectedItems: [
      //         ...currentItems,
      //         {
      //           ...item,
      //           quantity: 1,
      //           subtotal: item.variant.price,
      //           slug: item.slug,
      //         },
      //       ],
      //     })
      //   }
      // },

      // removeSelectedItem: (itemId: string) => {
      //   const currentItems = get().selectedItems
      //   const [orderId] = itemId.split('-')

      //   set({
      //     selectedItems: currentItems
      //       .map((item) => {
      //         if (item.slug === orderId) {
      //           const newQuantity = item.quantity - 1
      //           return newQuantity > 0
      //             ? { ...item, quantity: newQuantity }
      //             : item
      //         }
      //         return item
      //       })
      //       .filter((item) => item.quantity > 0),
      //   })
      // },

      // clearSelectedItems: () => {
      //   set({ selectedItems: [] })
      // },
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

      // getOrder: () => get().order,

      // addOrder: (orderInfo: IOrderDetail) => {
      //   set({ order: orderInfo })
      // },

      // removeOrder: () => {
      //   set({ order: null })
      // },

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
        const currentItems = get().selectedItems
        const [orderId] = itemId.split('-')

        set({
          selectedItems: currentItems
            .map((item) => {
              if (item.slug === orderId) {
                const newQuantity = item.quantity - 1
                return newQuantity > 0
                  ? { ...item, quantity: newQuantity }
                  : item
              }
              return item
            })
            .filter((item) => item.quantity > 0),
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

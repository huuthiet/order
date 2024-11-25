import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IMenuItemStore, IAddMenuItemRequest } from '@/types'

export const useMenuItemStore = create<IMenuItemStore>()(
  persist(
    (set, get) => ({
      menuItems: [],

      getMenuItems: () => get().menuItems,

      addMenuItem: (item: IAddMenuItemRequest) => {
        const { menuItems } = get()
        // Check if item already exists
        const exists = menuItems.some(
          (existingItem) => existingItem.productSlug === item.productSlug,
        )
        if (!exists) {
          set({ menuItems: [...menuItems, item] })
        }
      },

      removeMenuItem: (productSlug: string) => {
        const { menuItems } = get()
        set({
          menuItems: menuItems.filter(
            (item) => item.productSlug !== productSlug,
          ),
        })
      },

      clearMenuItems: () => {
        set({ menuItems: [] })
      },
    }),
    {
      name: 'menu-item-store',
    },
  ),
)

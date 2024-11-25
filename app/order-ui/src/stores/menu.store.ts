import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18next from 'i18next'
import { IMenuItemStore } from '@/types'

export const menuItemStore = create<IMenuItemStore>()(
  persist(
    (set, get) => ({
      menuItems: [],

      // Lấy danh sách productSlug
      getMenuItems: () => get().menuItems,

      // Thêm productSlug vào danh sách (nếu chưa có)
      addMenuItem: (item: string) =>
        set((state) => ({
          menuItems: state.menuItems.includes(item)
            ? state.menuItems
            : [...state.menuItems, item],
        })),

      // Xoá productSlug khỏi danh sách
      removeMenuItem: (menuItemId: string) =>
        set((state) => ({
          menuItems: state.menuItems.filter((id) => id !== menuItemId),
        })),

      // Xoá toàn bộ danh sách productSlug
      clearMenuItems: () => set({ menuItems: [] }),
    }),
    {
      name: 'menu-items-storage', // Key để lưu vào localStorage
    },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { IUserStore, IUserInfo } from '@/types'

export const useUserStore = create<IUserStore>()(
  persist(
    (set, get) => ({
      userInfo: null,
      setUserInfo: (userInfo: IUserInfo) => {
        set({ userInfo })
      },
      getUserInfo: () => get().userInfo,
      removeUserInfo: () => set({ userInfo: null }),
    }),
    {
      name: 'user-info',
    },
  ),
)

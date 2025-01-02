import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IBranch, IBranchStore } from '@/types'

export const useBranchStore = create<IBranchStore>()(
  persist(
    (set) => ({
      branch: undefined,
      setBranch: (branch?: IBranch) => set({ branch }),
      removeBranch: () => set({ branch: undefined }),
    }),
    {
      name: 'branch-storage',
    },
  ),
)

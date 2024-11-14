// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import { ITableStore } from '@/types/table.type'

// export const useTableStore = create<ITableStore>()(
//   persist(
//     (set, get) => ({
//       tables: [],
//       addTable: (table) => {
//         const { tables } = get()
//         set({
//           tables: [...tables, { ...table, id: tables.length + 1 }]
//         })
//       },
//       updateTablePosition: (id, position) => {
//         const { tables } = get()
//         set({
//           tables: tables.map((table) => (table.id === id ? { ...table, position } : table))
//         })
//       }
//     }),
//     {
//       name: 'table-store'
//     }
//   )
// )

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useTables } from '@/hooks'
import { useCartItemStore } from '@/stores'
import { Label } from '@/components/ui'

export default function TableSelect() {
  const { t } = useTranslation(['table'])
  const { data: tables } = useTables()
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const { getCartItems, addTable } = useCartItemStore()

  // Lấy danh sách cart items
  const cartItems = getCartItems()

  useEffect(() => {
    // Tìm orderItem nào có table được thiết lập
    const addedTable = cartItems?.table

    // Nếu tìm thấy và có table, gán giá trị cho selectedTable
    if (addedTable) {
      setSelectedTable(addedTable) // Gán giá trị mặc định
    }
  }, [cartItems])

  const handleTableSelect = (table: string) => {
    setSelectedTable(table)
    addTable(table)
  }

  return (
    <div className="mt-6 flex w-full flex-col gap-2 rounded-md border">
      <div className="bg-muted/60 p-4">
        <Label className="text-md">{t('table.title')}</Label>
      </div>
      <div className="flex h-full items-start justify-start gap-2 rounded-md border p-4">
        {tables?.result.map((table) => (
          <div
            key={table.slug}
            onClick={() => handleTableSelect(table.slug || '')}
            className={`flex h-[8rem] w-[8rem] cursor-pointer items-center justify-center rounded-md border p-4 transition-all duration-200 hover:border-primary ${
              selectedTable === table.slug ? 'border-primary bg-primary/10' : ''
            }`}
          >
            <div>{table.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

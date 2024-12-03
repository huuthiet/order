import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useTables } from '@/hooks'
import { useCartItemStore } from '@/stores'
import { useUserStore } from '@/stores'
import { ITable } from '@/types'
import { TableItem } from '../table/table-item'

export default function TableSelect() {
  const { t } = useTranslation(['table'])
  const { getUserInfo } = useUserStore()
  const { data: tables } = useTables(getUserInfo()?.branch.slug)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const { getCartItems, addTable, removeTable } = useCartItemStore()
  const cartItems = getCartItems()

  useEffect(() => {
    // Khôi phục trạng thái selected từ cart
    const addedTable = cartItems?.table
    if (addedTable) {
      setSelectedTableId(addedTable)
    }
  }, [cartItems])

  const handleTableClick = (table: ITable) => {
    if (selectedTableId === table.slug) {
      // Bỏ chọn table
      setSelectedTableId(null)
      removeTable()
    } else {
      // Chọn table
      setSelectedTableId(table.slug)
      addTable(table)
    }
  }

  return (
    <div className="flex flex-col w-full gap-2 mt-6 border rounded-md">
      <div className="p-4 bg-muted/60">
        <span className="font-medium text-md">{t('table.title')}</span>
      </div>
      <div className="relative flex flex-col min-h-[350px]">
        {/* Table status */}
        <div className="flex flex-row gap-4 p-4 ">
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 border rounded-sm bg-muted-foreground/10" />
            <span className="text-sm">{t('table.available')}</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-500 rounded-sm" />
            <span className="text-sm">{t('table.reserved')}</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="w-4 h-4 border-2 rounded-sm border-primary bg-muted-foreground/10" />
            <span className="text-sm">{t('table.selected')}</span>
          </div>
        </div>
        {tables?.result.map((table) => (
          <TableItem
            key={table.slug}
            table={table}
            isSelected={selectedTableId === table.slug}
            onContextMenu={(e) => e.preventDefault()}
            onClick={() => handleTableClick(table)}
          />

        ))}
      </div>
    </div>
  )
}

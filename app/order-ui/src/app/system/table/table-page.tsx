// import { useState } from 'react'
import { CreateTableDialog } from '@/components/app/dialog'
import { useTables } from '@/hooks'
import TableFlow from './table-flow'

export default function TablePage() {
  const { data: tables } = useTables()

  return (
    <div className="flex h-screen flex-col gap-4 px-4">
      <div className="flex items-center justify-end py-4">
        <CreateTableDialog />
      </div>
      <div className="flex-1 rounded-md">
        <TableFlow tables={tables?.result || []} />
      </div>
    </div>
  )
}

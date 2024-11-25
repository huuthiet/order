import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
// import { AddMenuItemDialog } from '@/components/app/dialog/add-menu-item-dialog'

import { DataTableColumnHeader, Checkbox } from '@/components/ui'
import { IProduct } from '@/types'
import { publicFileURL } from '@/constants'
import { AddMenuItemDialog } from '@/components/app/dialog'

export const useProductColumns = (): ColumnDef<IProduct>[] => {
  const { t } = useTranslation(['product'])

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.name')} />
      ),
      cell: ({ row }) => {
        const product = row.original
        return <AddMenuItemDialog product={product} />
      },
    },
    {
      accessorKey: 'image',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.image')} />
      ),
      cell: ({ row }) => {
        const image = row.getValue('image')
        return image ? (
          <img
            src={`${publicFileURL}/${image}`}
            className="w-20 rounded-md object-contain"
          />
        ) : null
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.name')} />
      ),
    },
    // {
    //   accessorKey: 'slug',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t('product.name')} />
    //   ),
    // },
    {
      accessorKey: 'catalog.name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.catalog')} />
      ),
    },
  ]
}

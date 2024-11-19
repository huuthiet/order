import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
// import { format } from 'date-fns'

import {
  Button,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui'
import { IProduct } from '@/types'
import moment from 'moment'
// import { DialogDeleteProject, DialogUpdateProject } from '@/components/app/dialog'

export const useProductColumns = (): ColumnDef<IProduct>[] => {
  const { t } = useTranslation(['product'])
  return [
    {
      accessorKey: 'image',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('product.image')} />
    },
    {
      accessorKey: 'slug',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('product.slug')} />
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('product.name')} />
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.createdAt')} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt')
        return createdAt ? moment(new Date(createdAt as string)).format('HH:mm DD/MM/YYYY') : ''
      }
    },
    {
      accessorKey: 'catalog.name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('product.catalog')} />
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.description')} />
      )
    },
    {
      id: 'actions',
      header: 'Thao tác',
      cell: () => {
        // const product = row.original
        return (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                  <span className="sr-only">Thao tác</span>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                {/* <DialogUpdateProject project={project} />
                <DialogDeleteProject project={project} /> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    }
  ]
}

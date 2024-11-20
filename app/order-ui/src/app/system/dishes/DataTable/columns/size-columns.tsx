import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import {
  Button,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui'
import { ISize } from '@/types'
import { DeleteSizeDialog, UpdateSizeDialog } from '@/components/app/dialog'
// import { DialogDeleteProject, DialogUpdateProject } from '@/components/app/dialog'

export const useSizeColumns = (): ColumnDef<ISize>[] => {
  const { t } = useTranslation(['product'])
  const { t: tCommon } = useTranslation(['common'])

  return [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('size.createdAt')} />,
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt')
        return createdAt ? moment(new Date(createdAt as string)).format('HH:mm DD/MM/YYYY') : ''
      }
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('size.name')} />
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('size.description')} />
      )
    },
    {
      id: 'actions',
      header: tCommon('common.action'),
      cell: ({ row }) => {
        const size = row.original
        return (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="flex justify-start w-full">
                <Button variant="ghost" className="w-8 h-8 p-0">
                  <span className="sr-only">{tCommon('common.action')}</span>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="flex flex-col justify-start min-w-[14rem] w-full"
              >
                <DropdownMenuLabel>{tCommon('common.action')}</DropdownMenuLabel>
                <UpdateSizeDialog size={size} />
                <DeleteSizeDialog size={size} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      }
    }
  ]
}

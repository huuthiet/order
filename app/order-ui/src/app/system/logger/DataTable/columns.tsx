import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
// import { format } from 'date-fns'

import { DataTableColumnHeader } from '@/components/ui'
import { ILogger } from '@/types'
import moment from 'moment'
// import { DialogDeleteProject, DialogUpdateProject } from '@/components/app/dialog'

export const useLoggerColumns = (): ColumnDef<ILogger>[] => {
  const { t } = useTranslation(['log'])
  return [
    {
      accessorKey: 'timestamp',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('log.createdAt')} />,
      cell: ({ row }) => {
        const timestamp = row.getValue('timestamp')
        return timestamp ? moment(new Date(timestamp as string)).format('HH:mm DD/MM/YYYY') : ''
      }
    },
    {
      accessorKey: 'level',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('log.level')} />
    },
    {
      accessorKey: 'slug',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('log.slug')} />
    },
    {
      accessorKey: 'message',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('log.message')} />
    },
    {
      accessorKey: 'context',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('log.context')} />
    },

    {
      accessorKey: 'pid',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('log.pid')} />
    }
  ]
}

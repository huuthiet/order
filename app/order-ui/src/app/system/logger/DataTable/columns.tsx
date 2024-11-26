import moment from 'moment'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { DataTableColumnHeader } from '@/components/ui'
import { ILogger } from '@/types'
import { LogLevelBadge } from '@/components/app/badge/index'

export const useLoggerColumns = (): ColumnDef<ILogger>[] => {
  const { t } = useTranslation(['log'])
  return [
    {
      accessorKey: 'timestamp',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('log.createdAt')} />
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue('timestamp')
        return timestamp
          ? moment(timestamp as string).format('HH:mm DD/MM/YYYY')
          : ''
      },
    },
    {
      accessorKey: 'level',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('log.level')} />
      ),
      cell: ({ row }) => {
        const level = row.original.level
        return level ? <LogLevelBadge level={level} /> : ''
      },
    },
    {
      accessorKey: 'message',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('log.message')} />
      ),
      cell: ({ row }) => row.getValue('message'),
    },
    {
      accessorKey: 'context',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('log.context')} />
      ),
      cell: ({ row }) => row.getValue('context'),
    },
    {
      accessorKey: 'pid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('log.pid')} />
      ),
      cell: ({ row }) => row.getValue('pid'),
    },
  ]
}

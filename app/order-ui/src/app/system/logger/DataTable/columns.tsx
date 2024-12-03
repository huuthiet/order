import moment from 'moment'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { DataTableColumnHeader } from '@/components/ui'
import { ILogger, TLoggerLevel } from '@/types'
import { LoggerLevel } from '@/constants'
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
        return (<div>
          {timestamp
            ? moment(timestamp as string).format('HH:mm DD/MM/YYYY')
            : ''}
        </div>)
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
      cell: ({ row }) => {
        const message = row.getValue('message') as string
        const level = row.getValue('level') as TLoggerLevel

        if (!message) return ''

        // Hàm xác định lớp CSS dựa trên nhiều điều kiện
        const getClassesByLevel = (level: TLoggerLevel) => {
          if (level === LoggerLevel.INFO) {
            return 'text-green-700'
          } else if (level === LoggerLevel.WARN) {
            return 'text-yellow-600'
          } else if (level === LoggerLevel.ERROR) {
            return 'text-red-700'
          }
          return 'text-gray-700'
        }

        return (
          <div
            className={`max-w-[20rem] whitespace-pre-wrap break-words py-2 ${getClassesByLevel(
              level
            )}`}
          >
            {message}
          </div>
        )
      }

    },
    {
      accessorKey: 'context',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('log.context')} />
      ),
      cell: ({ row }) => {
        const context = row.getValue('context') as string
        return (<div>
          <span className='text-sm whitespace-pre-wrap break-words w-[18rem]'>{context}</span>
        </div>)
      },
    },
    {
      accessorKey: 'pid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('log.pid')} />
      ),
      cell: ({ row }) => row.getValue('pid'),
    },
    // {
    //   accessorKey: 'actions',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={t('log.actions')} />
    //   ),
    //   cell: ({ row }) => {
    //     const log = row.original
    //     return (
    //       <div className="flex justify-center gap-2">
    //         <LogDetailDialog log={log} />
    //       </div>
    //     )
    //   },
    // },
  ]
}

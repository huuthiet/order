import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { MoreHorizontal } from 'lucide-react'

import {
  Button,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui'
import { IUserInfo } from '@/types'
import { ResetPasswordDialog, UserInfoDialog } from '@/components/app/dialog'
import UpdateUserRoleDialog from '@/components/app/dialog/update-user-role-dialog'
import { useUserStore } from '@/stores'
import { Role } from '@/constants'

export const useUserListColumns = (): ColumnDef<IUserInfo>[] => {
  const { t } = useTranslation(['user', 'common'])
  const { t: tCommon } = useTranslation(['common'])
  const { userInfo } = useUserStore()
  return [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.createdAt')} />
      ),
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt')
        return (
          <div className='text-sm'>
            {createdAt ? moment(createdAt).format('HH:mm DD/MM/YYYY') : ''}
          </div>
        )
      },
    },
    {
      accessorKey: 'slug',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.slug')} />
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className='text-sm'>
            {user?.slug}
          </div>
        )
      },
    },
    {
      accessorKey: 'fullname',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.name')} />
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className='text-sm'>
            {user?.firstName} {user?.lastName}
          </div>
        )
      },
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.phoneNumber')} />
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className='text-sm'>
            {user?.phonenumber}
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.email')} />
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className='text-sm'>
            {user?.email}
          </div>
        )
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.role')} />
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className='text-sm'>
            {user?.role?.name}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: tCommon('common.action'),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                  <span className="sr-only">{tCommon('common.action')}</span>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {tCommon('common.action')}
                </DropdownMenuLabel>
                <UserInfoDialog user={user} />
                {userInfo?.role.name === Role.SUPER_ADMIN && (
                  <div>
                    <ResetPasswordDialog user={user} />
                    <UpdateUserRoleDialog user={user} />
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}

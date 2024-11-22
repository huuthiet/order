import { NavLink } from 'react-router-dom'
import { User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui'
import { ProfileAvatar } from '@/components/app/avatar'
import { LogoutDialog } from '@/components/app/dialog'
import { ROUTE } from '@/constants'

export default function HeaderDropdown() {
  const { t } = useTranslation(['sidebar'])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <ProfileAvatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <span>{t('header.myProfile')}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="h-9 px-0">
            <NavLink
              to={`${ROUTE.PROFILE}`}
              className="flex h-9 w-full justify-start"
            >
              <Button
                variant="ghost"
                className="flex h-9 w-full justify-start gap-1 text-sm"
              >
                <User className="icon" />
                {t('header.profile')}
              </Button>
            </NavLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
          <LifeBuoy />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <LogoutDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

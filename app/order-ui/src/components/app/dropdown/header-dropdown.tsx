import { NavLink } from 'react-router-dom'
import { LogIn, User } from 'lucide-react'
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
import { useAuthStore } from '@/stores'

export default function HeaderDropdown() {
  const { t } = useTranslation(['sidebar'])
  const { isAuthenticated } = useAuthStore()
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
          <DropdownMenuItem className="px-0 h-9">
            <NavLink
              to={`${ROUTE.PROFILE}`}
              className="flex justify-start w-full h-9"
            >
              <Button
                variant="ghost"
                className="flex justify-start w-full gap-1 text-sm"
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
        {isAuthenticated() ? (
          <LogoutDialog />
        ) : (
          <NavLink to={ROUTE.LOGIN}>
            <Button variant="ghost" className="flex items-center justify-start w-full gap-2">
              <LogIn />
              {t('header.login')}
            </Button>
          </NavLink>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

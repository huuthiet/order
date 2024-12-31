import { NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'

import { DropdownClientHeader, ModeToggle } from '@/components/app/dropdown'
import { useCartItemStore } from '@/stores'
import { Logo } from '@/assets/images'
import { ROUTE } from '@/constants'
import { Button, SidebarTrigger } from '../ui'

export default function ClientLandingHeader({
  isMobile,
}: {
  isMobile: boolean
}) {
  const { getCartItems } = useCartItemStore()
  return (
    <header className="container sticky top-0 z-20 mx-auto w-full px-3 backdrop-blur supports-[backdrop-filter]:bg-white">
      <div className="flex h-14 w-full flex-1 items-center justify-between gap-6">
        {isMobile && <SidebarTrigger className={`${isMobile ? '' : ''}`} />}
        <NavLink to="/" className="flex items-center gap-2">
          {<img src={Logo} alt="logo" className="h-6 w-fit" />}
        </NavLink>
        {!isMobile && (
          <div className="flex flex-row items-center justify-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              <span className="text-sm">Trang chủ</span>
            </NavLink>
            <NavLink
              to={ROUTE.CLIENT_MENU}
              className={({ isActive }) =>
                `flex items-center gap-2 ${isActive ? 'text-primary' : ''}`
              }
            >
              <span className="text-sm text-muted-foreground">Thực đơn</span>
            </NavLink>
            <div className="text-sm text-muted-foreground">Về chúng tôi</div>
            <div className="text-sm text-muted-foreground">Điều khoản</div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          {!isMobile && (
            <NavLink to="/cart" className="relative flex items-center gap-2">
              <Button
                variant="ghost"
                className="relative text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <ShoppingCart className="text-muted-foreground" />
                {getCartItems()?.orderItems?.length ? (
                  <span className="absolute right-2 top-2 flex h-4 w-4 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {getCartItems()?.orderItems.length}
                  </span>
                ) : null}
              </Button>
            </NavLink>
          )}

          {/* {!isMobile && ( */}
          <ModeToggle />
          <DropdownClientHeader />
          {/* <span className="flex-col hidden sm:flex">
                            <span className="ml-2 text-sm font-semibold">
                                {userInfo?.firstName} {userInfo?.lastName}
                            </span>
                        </span> */}
        </div>
      </div>
    </header>
  )
}

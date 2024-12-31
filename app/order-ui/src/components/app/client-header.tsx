import { NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'

import { DropdownClientHeader, ModeToggle } from '@/components/app/dropdown'
import { useCartItemStore } from '@/stores'
import { Logo } from '@/assets/images'
import { ROUTE } from '@/constants'
import { Button } from '../ui'

export default function ClientHeader({ isMobile }: { isMobile: boolean }) {
  const { getCartItems } = useCartItemStore()
  return (
    <header className="sticky top-0 z-30 w-full bg-white text-muted-foreground shadow-md backdrop-blur">
      <div className="container">
        <div className="flex h-14 w-full flex-1 items-center justify-between gap-6">
          {/* Trigger */}
          {/* {isMobile && <SidebarTrigger />} */}

          {/* Left content*/}
          <NavLink to={ROUTE.HOME} className="flex items-center gap-2">
            {<img src={Logo} alt="logo" className="h-6 w-fit" />}
          </NavLink>

          {/* center content */}
          {!isMobile && (
            <div className="flex flex-row items-center justify-center gap-6">
              <NavLink
                to={ROUTE.HOME}
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                }
              >
                <span className="text-sm">Trang chủ</span>
              </NavLink>
              <NavLink
                to={ROUTE.CLIENT_MENU}
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                }
              >
                <span className="text-sm">Thực đơn</span>
              </NavLink>
              <div className="cursor-pointer text-sm">Về chúng tôi</div>
              <div className="cursor-pointer text-sm">Điều khoản</div>
            </div>
          )}

          {/* Right content */}
          <div className="flex items-center justify-end gap-2">
            {/* Cart */}
            <NavLink
              to={ROUTE.CLIENT_CART}
              className="relative flex items-center gap-2"
            >
              <Button
                variant="ghost"
                className="relative text-muted-foreground hover:bg-primary/10 hover:text-primary"
              >
                <ShoppingCart />
                {getCartItems()?.orderItems?.length ? (
                  <span className="absolute right-2 top-2 flex h-4 w-4 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {getCartItems()?.orderItems.length}
                  </span>
                ) : null}
              </Button>
            </NavLink>

            {/* Settings */}
            <ModeToggle />

            {/* Login + Profile */}
            <DropdownClientHeader />
          </div>
        </div>
      </div>
    </header>
  )
}

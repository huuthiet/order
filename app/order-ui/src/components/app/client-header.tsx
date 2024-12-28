'use client'
import { NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'

import { DropdownHeader, ModeToggle } from '@/components/app/dropdown'
import { useCartItemStore } from '@/stores'
import { Logo } from '@/assets/images'
import { ROUTE } from '@/constants'
import { Button, SidebarTrigger } from '../ui'

export default function ClientHeader({ isMobile }: { isMobile: boolean }) {
    const { getCartItems } = useCartItemStore()
    return (
        <header className="sticky top-0 z-20 w-full px-3 backdrop-blur supports-[backdrop-filter]:bg-transparent border-b text-muted-foreground border-muted-border">
            <div className="flex items-center justify-between flex-1 w-full gap-6 h-14">
                {isMobile && (
                    <SidebarTrigger />
                )}
                <NavLink to="/" className="flex items-center gap-2">
                    {<img src={Logo} alt="logo" className="h-6 w-fit" />}
                </NavLink>
                {!isMobile && (
                    <div className="flex flex-row items-center justify-center gap-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground"}`
                            }
                        >
                            <span className="text-sm">Trang chủ</span>
                        </NavLink>
                        <NavLink
                            to={ROUTE.CLIENT_MENU}
                            className={({ isActive }) =>
                                `flex items-center gap-2 ${isActive ? "text-primary" : "text-white"}`
                            }
                        >
                            <span className="text-sm">Thực đơn</span>
                        </NavLink>
                        <div className='text-sm'>
                            Về chúng tôi
                        </div>
                        <div className='text-sm'>
                            Điều khoản
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-end gap-2">
                    <NavLink to="/cart" className="relative flex items-center gap-2">
                        <Button variant="ghost" className="relative hover:bg-primary/10 text-muted-foreground hover:text-primary">
                            <ShoppingCart />
                            {getCartItems()?.orderItems?.length ? (
                                <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 rounded-full right-2 top-2 bg-primary">
                                    {getCartItems()?.orderItems.length}
                                </span>
                            ) : null}
                        </Button>
                    </NavLink>
                    <ModeToggle />
                    <DropdownHeader />
                </div>
            </div>
        </header>
    )
}

import { useState } from 'react'

import MenuList from './menu-list'
import { CartContent } from '@/router/loadable'
import { CartToggleButton } from '@/components/app/button'
import { CurrentDateInput } from '@/components/app/input'
import { useSidebar } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui'
import { useIsMobile } from '@/hooks'
import { CartDrawer } from '@/components/app/drawer'

export default function MenuPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { state } = useSidebar()
  const isMobile = useIsMobile()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="flex h-full flex-row gap-2">
      <div
        className={`flex flex-col transition-all duration-300 ease-in-out ${isCartOpen ? 'w-full md:w-[70%]' : 'w-full'} ${isCollapsed ? 'pl-2' : ''}`}
      >
        {/* Fixed Header Section */}
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between gap-2 bg-background py-3 pr-4">
          <CurrentDateInput />
          {/* <MenuCategorySelect /> */}
          {!isMobile && (
            <CartToggleButton
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
            />
          )}
          {isMobile && <CartDrawer />}
          {/* <SidebarTrigger /> */}
        </div>

        {/* Scrollable Content Section */}
        <ScrollArea className="mt-2 flex-1">
          <MenuList isCartOpen={isCartOpen} />
        </ScrollArea>
      </div>

      {/* Cart Section - Fixed */}
      <div
        className={`fixed right-0 h-[calc(100vh-6.5rem)] border-l bg-background transition-all duration-300 ease-in-out ${
          isCartOpen ? 'w-[25%]' : 'w-0 opacity-0'
        }`}
      >
        {isCartOpen && !isMobile && <CartContent />}
      </div>
    </div>
  )
}

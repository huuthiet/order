import { useState } from 'react'

import MenuList from './menu-list'
import { CartContent } from '@/router/loadable'
import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { CartToggleButton } from '@/components/app/button'
import { useSidebar } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui'
import { DateSelect, MenuCategorySelect } from '@/components/app/select'

export default function MenuPage() {
  const [isCartOpen, setIsCartOpen] = useState(true)
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="flex flex-row gap-2 h-[calc(100vh-4rem)]">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div
          className={`transition-all duration-300 ease-in-out${
            isCartOpen ? 'w-[70%]' : 'w-full'
          } ${isCollapsed ? 'pl-2' : 'pl-4'}`}
        >
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 py-3 pr-4 bg-background">
            <div className="flex flex-row items-center justify-between w-full">
              <BreadcrumbComponent />
              <CartToggleButton isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
            </div>
            <div className="flex justify-end w-full gap-2">
              <DateSelect />
              <MenuCategorySelect />
            </div>
          </div>
          <div className="pr-4">
            <MenuList isCartOpen={isCartOpen} />
          </div>
        </div>
      </ScrollArea>

      {/* Cart Section - Fixed */}
      <div
        className={`transition-all duration-300 ease-in-out border-l bg-background ${
          isCartOpen ? 'w-[30%]' : 'w-0 opacity-0'
        } sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        {isCartOpen && <CartContent />}
      </div>
    </div>
  )
}

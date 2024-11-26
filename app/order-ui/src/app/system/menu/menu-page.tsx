import { useState } from 'react'

import MenuList from './menu-list'
import { CartContent } from '@/router/loadable'
import { CartToggleButton } from '@/components/app/button'
import { MenuCategorySelect } from '@/components/app/select'
import { CurrentDateInput } from '@/components/app/input'
import { useSidebar } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui'

export default function MenuPage() {
  const [isCartOpen, setIsCartOpen] = useState(true)
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-row gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div
          className={`transition-all duration-300 ease-in-out${
            isCartOpen ? 'w-[70%]' : 'w-full'
          } ${isCollapsed ? 'pl-2' : 'pl-4'}`}
        >
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-background py-3 pr-4">
            <div className="flex w-full flex-row items-center justify-end">
              <CartToggleButton
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
              />
            </div>
            <div className="flex w-full justify-end gap-2">
              {/* <DateSelect /> */}
              <CurrentDateInput />
              {/* <CatalogSelect /> */}
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
        className={`border-l bg-background transition-all duration-300 ease-in-out ${
          isCartOpen ? 'w-[30%]' : 'w-0 opacity-0'
        } sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        {isCartOpen && <CartContent />}
      </div>
    </div>
  )
}

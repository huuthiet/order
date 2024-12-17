import { useState } from 'react'

import { CartContent } from '@/router/loadable'
import { CartToggleButton } from '@/components/app/button'
import { useSidebar } from '@/components/ui'
import { ScrollArea } from '@/components/ui'

export default function MenuPage() {
  const [isCartOpen, setIsCartOpen] = useState(true)
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="flex h-full flex-row gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div
          className={`transition-all duration-300 ease-in-out${
            isCartOpen ? 'w-[70%]' : 'w-full'
          } ${isCollapsed ? 'pl-2' : 'pl-4'}`}
        >
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 py-3 pr-4">
            <div className="flex w-full flex-row items-center justify-between">
              <CartToggleButton
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
              />
            </div>
            {/* <div className="flex justify-end w-full gap-2">
              <DateSelect />
              <MenuCategorySelect />
            </div> */}
          </div>
          <div className="pr-4"></div>
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

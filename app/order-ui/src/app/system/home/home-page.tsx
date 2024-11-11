import { useState } from 'react'
import MenuList from './menu-list'
import { useDishes } from '@/hooks'
import { CartContent } from '@/router/loadable'
import { SkeletonCart, SkeletonMenuList } from '@/components/app/skeleton'
import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { CartToggleButton } from '@/components/app/button'
import { useSidebar } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui'

export default function HomePage() {
  const { data, isLoading } = useDishes()
  const [isCartOpen, setIsCartOpen] = useState(true)
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  if (isLoading) {
    return (
      <div className={`flex gap-2 py-4 ${isCollapsed ? 'pl-2' : 'pl-4'}`}>
        <div className={`${isCartOpen ? 'w-[65%]' : 'w-full'}`}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <SkeletonMenuList key={index} />
            ))}
          </div>
        </div>
        {isCartOpen && (
          <div className="w-[35%] border-l">
            <SkeletonCart />
          </div>
        )}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl font-semibold">No data found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-row gap-2 h-[calc(100vh-4rem)]">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div
          className={`transition-all duration-300 ease-in-out${
            isCartOpen ? 'w-[70%]' : 'w-full'
          } ${isCollapsed ? 'pl-2' : 'pl-4'}`}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between py-3 pr-4 bg-background">
            <BreadcrumbComponent />
            <CartToggleButton isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
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

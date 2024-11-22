import { useState } from 'react'

import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { useSidebar } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui'
import { ProfileForm } from '@/components/app/form'

export default function ProfilePage() {
  const [isCartOpen] = useState(true)
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
            <div className="flex w-full flex-row items-center justify-between">
              <BreadcrumbComponent />
            </div>
            <div className="w-full">
              <ProfileForm />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

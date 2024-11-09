import { Outlet } from 'react-router-dom'

import { SidebarProvider } from '@/components/ui'
import { AppSidebar, AppHeader } from '@/components/app'

export default function StaffLayout() {
  return (
    <SidebarProvider>
      <div className="box-border flex w-full min-h-screen ">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <AppHeader />

          {/* Page content */}
          <main className="flex-1 px-4 pt-4 pb-2 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

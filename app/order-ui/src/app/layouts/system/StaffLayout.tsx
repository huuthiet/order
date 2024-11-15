import { Outlet } from 'react-router-dom'
import { SidebarProvider, ScrollArea } from '@/components/ui'
import { AppSidebar, AppHeader } from '@/components/app'

export default function StaffLayout() {
  return (
    <SidebarProvider>
      <div className="box-border flex flex-1 min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex flex-col flex-1 h-screen overflow-hidden ">
          {/* Header */}
          <AppHeader />

          {/* Page content */}
          <ScrollArea>
            <main>
              <Outlet />
            </main>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  )
}

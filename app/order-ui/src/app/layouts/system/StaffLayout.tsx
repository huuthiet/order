import { Outlet } from 'react-router-dom'
import { SidebarProvider, ScrollArea } from '@/components/ui'
import { AppSidebar, AppHeader } from '@/components/app'
import { BreadcrumbComponent } from '@/components/app/breadcrumb'

export default function StaffLayout() {
  return (
    <SidebarProvider>
      <div className="box-border flex min-h-screen flex-1">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          {/* Header */}
          <AppHeader />

          {/* Page content */}
          <div className="sticky top-0 z-10 p-4">
            <BreadcrumbComponent />
          </div>
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

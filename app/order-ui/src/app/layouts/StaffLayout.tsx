import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/app/app-sidebar'
import { AppHeader } from '@/components/app'
import { Outlet } from 'react-router-dom'

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
          <main className="flex-1 p-6 mt-12 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

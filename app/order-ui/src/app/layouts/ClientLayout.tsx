import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/app/app-sidebar'
import { Outlet } from 'react-router-dom'

export default function ClientLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  )
}

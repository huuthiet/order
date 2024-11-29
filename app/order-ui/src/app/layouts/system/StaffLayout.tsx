import { Outlet } from 'react-router-dom'
import { SidebarProvider, ScrollArea } from '@/components/ui'
import { AppSidebar, AppHeader } from '@/components/app'
import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib'

export default function StaffLayout() {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="box-border flex min-h-screen flex-1">
        {/* Sidebar - Hidden on mobile by default */}
        <AppSidebar />

        {/* Main content */}
        <div className="relative flex h-[100dvh] flex-1 flex-col overflow-hidden">
          {/* Header - Fixed on mobile */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <AppHeader />
          </div>

          {/* Breadcrumb - Responsive padding */}
          <div
            className={cn(
              'sticky z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
              isMobile ? 'px-3 py-2' : 'p-4',
            )}
          >
            <BreadcrumbComponent />
          </div>

          {/* Main scrollable area */}
          <ScrollArea className="flex-1">
            <main
              className={cn(
                'min-h-full',
                isMobile ? 'px-3 pb-[env(safe-area-inset-bottom)]' : 'px-4',
              )}
            >
              <Outlet />
            </main>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  )
}

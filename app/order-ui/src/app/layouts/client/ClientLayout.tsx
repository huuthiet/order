import { Outlet } from 'react-router-dom';

import { SidebarProvider, ScrollArea } from '@/components/ui';
import { AppSidebar, ClientHeader } from '@/components/app';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib';
import { DownloadProgress } from '@/components/app/progress';
import { useDownloadStore } from '@/stores';
import { BreadcrumbComponent } from '@/components/app/breadcrumb';
// import { ROUTE } from '@/constants';
// import { DropdownHeader, ModeToggle } from '@/components/app/dropdown';

export default function ClientLayout() {
  const isMobile = useIsMobile();
  const { progress, fileName, isDownloading } = useDownloadStore();
  // const { getCartItems } = useCartItemStore();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div
        className="box-border flex flex-1 min-h-screen"
      >
        {/* Sidebar - Hidden on mobile by default */}
        {isMobile && <AppSidebar />}

        {/* Main content */}
        <div className="relative flex h-[100dvh] flex-1 px-2 flex-col overflow-hidden">
          {/* Header - Fixed on mobile */}
          <div className="sticky top-0 z-3">
            <ClientHeader isMobile={isMobile} />
          </div>

          {/* Breadcrumb - Responsive padding */}
          <div className={cn('sticky z-20 mx-auto container', isMobile ? 'py-2' : 'py-4')}>
            <BreadcrumbComponent />
          </div>

          {/* Main scrollable area */}
          <ScrollArea className="flex-1 px-2">
            <main
              className={cn(
                'min-h-full',
                isMobile ? 'pb-[env(safe-area-inset-bottom)]' : ''
              )}
            >
              <Outlet />
              {isDownloading && (
                <DownloadProgress progress={progress} fileName={fileName} />
              )}
            </main>
          </ScrollArea>

          {/* Bottom App Header for Mobile */}
          {/* {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4 bg-white border-t border-gray-200 h-14">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground"}`
                }
              >
                <span className="text-sm">Trang chủ</span>
              </NavLink>
              <NavLink
                to={ROUTE.CLIENT_MENU}
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground"}`
                }
              >
                <span className="text-sm">Thực đơn</span>
              </NavLink>
              <NavLink to="/cart" className="relative flex items-center gap-2">
                <Button variant="ghost" className="relative hover:bg-primary/10 text-muted-foreground hover:text-primary">
                  <ShoppingCart />
                  {getCartItems()?.orderItems?.length ? (
                    <span className="absolute flex items-center justify-center w-4 h-4 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 rounded-full right-2 top-2 bg-primary">
                      {getCartItems()?.orderItems.length}
                    </span>
                  ) : null}
                </Button>
              </NavLink>
            </div>
          )} */}
        </div>
      </div>
    </SidebarProvider>
  );
}

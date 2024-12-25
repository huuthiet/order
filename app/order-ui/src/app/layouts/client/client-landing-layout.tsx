import { Outlet } from 'react-router-dom';

import { SidebarProvider, ScrollArea } from '@/components/ui';
import { AppSidebar, ClientHeader } from '@/components/app';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib';
import { DownloadProgress } from '@/components/app/progress';
import { useDownloadStore } from '@/stores';
// import { DropdownHeader, ModeToggle } from '@/components/app/dropdown';

export default function ClientLandingLayout() {
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
                <div className="relative flex h-[100dvh] flex-1 flex-col overflow-hidden">
                    {/* Header - Fixed on mobile */}
                    <div className="sticky top-0 z-3">
                        <ClientHeader isMobile={isMobile} />
                    </div>

                    {/* Breadcrumb - Responsive padding */}
                    <div className={cn('sticky z-20', isMobile ? 'px-3 py-2' : '')}>
                        {/* <BreadcrumbComponent /> */}
                    </div>

                    {/* Main scrollable area */}
                    <ScrollArea className="flex-1">
                        <main
                            className={cn(
                                'min-h-full',
                                isMobile ? 'px-2 pb-[env(safe-area-inset-bottom)]' : ''
                            )}
                        >
                            <Outlet />
                            {isDownloading && (
                                <DownloadProgress progress={progress} fileName={fileName} />
                            )}
                        </main>
                    </ScrollArea>

                    {/* Footer */}

                </div>
            </div>
        </SidebarProvider>
    );
}

import { Outlet } from 'react-router-dom';
import { Facebook, MapPin, Phone } from 'lucide-react';

import { SidebarProvider, ScrollArea } from '@/components/ui';
import { AppSidebar, ClientLandingHeader } from '@/components/app';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib';
import { DownloadProgress } from '@/components/app/progress';
import { useDownloadStore } from '@/stores';
import { Logo, Store1 } from '@/assets/images';
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
                        <ClientLandingHeader isMobile={isMobile} />
                    </div>
                    {/* Breadcrumb - Responsive padding */}
                    <div className={cn('sticky z-20', isMobile ? 'px-3 py-2' : '')}>
                        {/* <BreadcrumbComponent /> */}
                    </div>
                    {/* Main scrollable area */}
                    <ScrollArea className="flex-1">
                        <main
                            className={cn(

                                isMobile ? 'px-2 pb-[env(safe-area-inset-bottom)]' : ''
                            )}
                        >
                            <Outlet />
                            {isDownloading && (
                                <DownloadProgress progress={progress} fileName={fileName} />
                            )}
                        </main>
                        <footer className="grid grid-cols-4 py-6 text-center text-white bg-black">
                            <div className='flex items-start justify-center col-span-1'>
                                <div className='flex flex-col items-start justify-center gap-2 w-fit'>
                                    <span className='font-bold'>
                                        Giới thiệu
                                    </span>
                                    <span className='text-sm'>
                                        Về chúng tôi
                                    </span>
                                    <span className='text-sm'>
                                        Sản phẩm
                                    </span>
                                    <span className='text-sm'>
                                        Khuyến mãi
                                    </span>
                                    <span className='text-sm'>
                                        Cửa hàng
                                    </span>
                                    <span className='text-sm'>
                                        Tuyển dụng
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-start justify-center col-span-1'>
                                <div className='flex flex-col items-start justify-center gap-2 w-fit'>
                                    <span className='font-bold'>
                                        Điều khoản
                                    </span>
                                    <span className='text-sm'>
                                        Điều khoản sử dụng
                                    </span>
                                    <span className='text-sm'>
                                        Chính sách bảo mật thông tin
                                    </span>
                                </div>
                            </div>
                            <div className='flex items-start justify-center col-span-1'>
                                <div className='flex flex-col items-start justify-center gap-2 w-fit'>
                                    <span className='flex items-center gap-2 text-sm'>
                                        <Phone size={18} /> Hotline: 0123 456 789
                                    </span>
                                    <span className='flex items-center gap-2 text-sm'>
                                        <MapPin size={18} /> Liên hệ
                                    </span>
                                    <span className='text-xs'>
                                        01 Võ Văn Ngân, Thủ Đức, TP. Hồ Chí Minh
                                    </span>
                                </div>
                            </div>
                            <div className="relative flex flex-col items-start justify-center col-span-1 gap-2">
                                <div className="relative">
                                    <img src={Store1} alt="store" className="w-full h-32 rounded-sm" />
                                    <img
                                        src={Logo}
                                        alt="logo"
                                        className="absolute top-0 left-0 w-auto h-5 m-2" // Đặt Logo ở góc trên trái với margin
                                    />
                                </div>
                                <Facebook />
                            </div>
                        </footer>
                    </ScrollArea>
                </div>
            </div>
        </SidebarProvider >
    );
}

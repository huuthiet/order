import { NavLink, Outlet } from 'react-router-dom';

import { SidebarProvider, ScrollArea } from '@/components/ui';
import { AppSidebar, ClientHeader } from '@/components/app';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib';
import { DownloadProgress } from '@/components/app/progress';
import { useDownloadStore } from '@/stores';
import { BreadcrumbComponent } from '@/components/app/breadcrumb';
import { Facebook, MapPin, Phone, Youtube } from 'lucide-react';
import { Logo, LogoWhite, Store1 } from '@/assets/images';
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
        <div className="relative flex h-[100dvh] flex-1 flex-col overflow-hidden">
          {/* Header - Fixed on mobile */}
          <div className="sticky top-0 z-3">
            <ClientHeader isMobile={isMobile} />
          </div>

          {/* Breadcrumb - Responsive padding */}
          <div className={cn('sticky z-20 mx-auto container', isMobile ? 'py-2' : 'py-4')}>
            <BreadcrumbComponent />
          </div>

          {/* Main scrollable area */}
          <ScrollArea className="flex-1">
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
            <footer className="text-white bg-black">
              <div className="container px-4 py-6 mx-auto">
                {!isMobile ? (
                  <div className='grid sm:grid-cols-4'>
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
                    <div className='flex flex-col items-start justify-start gap-2 w-fit'>
                      <span className='font-bold'>
                        Điều khoản
                      </span>
                      <span className='text-sm'>
                        Điều khoản sử dụng
                      </span>
                      <span className='text-sm'>
                        Chính sách bảo mật
                      </span>
                    </div>
                    <div className='flex flex-col items-start justify-start gap-2 w-fit'>
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
                    {!isMobile && (
                      <div className="relative flex flex-col items-end justify-start w-full col-span-1 gap-2">
                        <div className='flex flex-col justify-start gap-2 w-fit'>
                          <div className="relative">
                            <img src={Store1} alt="store" className="h-32 rounded-sm" />
                            <img
                              src={Logo}
                              alt="logo"
                              className="absolute top-0 left-0 w-auto h-5 m-2" // Đặt Logo ở góc trên trái với margin
                            />
                          </div>
                          <div className='flex gap-2'>
                            <NavLink to={`https://www.facebook.com/thangquyet0501/`} className="flex items-center justify-center px-2 text-xs transition-all duration-200 rounded-md hover:text-primary sm:text-sm hover:bg-primary/20 hover:scale-105">
                              <Facebook />
                            </NavLink>
                            <NavLink to={`https://www.youtube.com/@KhoaiLangThang`} className="flex items-center justify-center px-2 text-xs transition-all duration-200 rounded-md hover:text-primary sm:text-sm hover:bg-primary/20 hover:scale-105">
                              <Youtube />
                            </NavLink>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='flex flex-col items-start justify-center gap-4 sm:flex-row'>
                    <div className='grid items-start justify-center grid-cols-2 col-span-1 gap-2'>
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
                      <div className='flex flex-col items-start justify-center gap-2 w-fit'>
                        <span className='font-bold'>
                          Điều khoản
                        </span>
                        <span className='text-sm'>
                          Điều khoản sử dụng
                        </span>
                        <span className='text-sm'>
                          Chính sách bảo mật
                        </span>
                      </div>

                    </div>
                    <div className='flex flex-col items-start justify-start w-full gap-2'>
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
                )}

                {isMobile && (
                  <div className="relative flex flex-col items-start justify-center col-span-1 gap-4 mt-4">
                    <div className="relative">
                      <img src={Store1} alt="store" className="w-full h-40 rounded-sm" />
                      <img
                        src={LogoWhite}
                        alt="logo"
                        className="absolute top-0 left-0 w-auto h-5 m-2" // Đặt Logo ở góc trên trái với margin
                      />
                    </div>
                    <div className='flex gap-2'>
                      <NavLink to={`https://www.facebook.com/thangquyet0501/`} className="flex items-center justify-center px-2 text-xs transition-all duration-200 rounded-md hover:text-primary sm:text-sm hover:bg-primary/20 hover:scale-105">
                        <Facebook />
                      </NavLink>
                      <NavLink to={`https://www.youtube.com/@KhoaiLangThang`} className="flex items-center justify-center px-2 text-xs transition-all duration-200 rounded-md hover:text-primary sm:text-sm hover:bg-primary/20 hover:scale-105">
                        <Youtube />
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            </footer>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}

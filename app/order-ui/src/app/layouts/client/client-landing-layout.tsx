import { NavLink, Outlet } from 'react-router-dom'
import { Facebook, MapPin, Phone, Youtube } from 'lucide-react'

import { SidebarProvider, ScrollArea } from '@/components/ui'
import { AppSidebar, ClientLandingHeader } from '@/components/app'
import { useIsMobile } from '@/hooks/use-mobile'
import { DownloadProgress } from '@/components/app/progress'
import { useDownloadStore } from '@/stores'
import { Logo, Store1 } from '@/assets/images'

export default function ClientLandingLayout() {
  const isMobile = useIsMobile()
  const { progress, fileName, isDownloading } = useDownloadStore()

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="box-border flex min-h-screen flex-1">
        {/* Sidebar - Hidden on mobile by default */}
        {isMobile && <AppSidebar />}
        {/* Main content */}
        <div className="relative flex h-[100dvh] flex-1 flex-col overflow-hidden">
          {/* Header - Fixed on mobile */}
          <div className="z-3 sticky top-0">
            <ClientLandingHeader isMobile={isMobile} />
          </div>

          {/* Main scrollable area */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              <main>
                <Outlet />
                {isDownloading && (
                  <DownloadProgress progress={progress} fileName={fileName} />
                )}
              </main>
              <footer className="bg-black text-white">
                <div className="container mx-auto px-4 py-6">
                  {!isMobile ? (
                    <div className="grid sm:grid-cols-4">
                      <div className="flex w-fit flex-col items-start justify-center gap-2">
                        <span className="font-bold">Giới thiệu</span>
                        <span className="text-sm">Về chúng tôi</span>
                        <span className="text-sm">Sản phẩm</span>
                        <span className="text-sm">Khuyến mãi</span>
                        <span className="text-sm">Cửa hàng</span>
                        <span className="text-sm">Tuyển dụng</span>
                      </div>
                      <div className="flex w-fit flex-col items-start justify-start gap-2">
                        <span className="font-bold">Điều khoản</span>
                        <span className="text-sm">Điều khoản sử dụng</span>
                        <span className="text-sm">Chính sách bảo mật</span>
                      </div>
                      <div className="flex w-fit flex-col items-start justify-start gap-2">
                        <span className="flex items-center gap-2 text-sm">
                          <Phone size={18} /> Hotline: 0123 456 789
                        </span>
                        <span className="flex items-center gap-2 text-sm">
                          <MapPin size={18} /> Liên hệ
                        </span>
                        <span className="text-xs">
                          01 Võ Văn Ngân, Thủ Đức, TP. Hồ Chí Minh
                        </span>
                      </div>
                      {!isMobile && (
                        <div className="relative col-span-1 flex w-full flex-col items-end justify-start gap-2">
                          <div className="flex w-fit flex-col justify-start gap-2">
                            <div className="relative">
                              <img
                                src={Store1}
                                alt="store"
                                className="h-32 rounded-sm"
                              />
                              <img
                                src={Logo}
                                alt="logo"
                                className="absolute left-0 top-0 m-2 h-5 w-auto" // Đặt Logo ở góc trên trái với margin
                              />
                            </div>
                            <Facebook />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="col-span-1 grid grid-cols-2 items-start justify-center">
                      <div className="flex w-fit flex-col items-start justify-center gap-2">
                        <span className="font-bold">Giới thiệu</span>
                        <span className="text-sm">Về chúng tôi</span>
                        <span className="text-sm">Sản phẩm</span>
                        <span className="text-sm">Khuyến mãi</span>
                        <span className="text-sm">Cửa hàng</span>
                        <span className="text-sm">Tuyển dụng</span>
                      </div>
                      <div className="flex w-fit flex-col items-start justify-center gap-2">
                        <span className="font-bold">Điều khoản</span>
                        <span className="text-sm">Điều khoản sử dụng</span>
                        <span className="text-sm">Chính sách bảo mật</span>
                      </div>
                    </div>
                  )}

                  {isMobile && (
                    <div className="relative col-span-1 flex flex-col items-start justify-center gap-4">
                      <div className="relative">
                        <img
                          src={Store1}
                          alt="store"
                          className="h-40 w-full rounded-sm"
                        />
                        <img
                          src={Logo}
                          alt="logo"
                          className="absolute left-0 top-0 m-2 h-5 w-auto" // Đặt Logo ở góc trên trái với margin
                        />
                      </div>
                      <div className="flex gap-2">
                        <NavLink
                          to={`https://www.facebook.com/thangquyet0501/`}
                          className="flex items-center justify-center rounded-md px-2 text-xs transition-all duration-200 hover:scale-105 hover:bg-primary/20 hover:text-primary sm:text-sm"
                        >
                          <Facebook />
                        </NavLink>
                        <NavLink
                          to={`https://www.youtube.com/@KhoaiLangThang`}
                          className="flex items-center justify-center rounded-md px-2 text-xs transition-all duration-200 hover:scale-105 hover:bg-primary/20 hover:text-primary sm:text-sm"
                        >
                          <Youtube />
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              </footer>
            </div>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  )
}

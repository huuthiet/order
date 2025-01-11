import { Outlet } from 'react-router-dom'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib'
import { DownloadProgress } from '@/components/app/progress'
import { useDownloadStore } from '@/stores'
import { ClientHeader, ClientFooter, BackToTop } from './components'

export default function ClientLayout() {
  const isMobile = useIsMobile()
  const { progress, fileName, isDownloading } = useDownloadStore()

  return (
    <>
      {/* Main content */}
      <div className="">
        {/* Header */}
        <ClientHeader />

        {/* Main content */}
        <main
          className={cn(
            'min-h-full',
            isMobile ? 'pb-[env(safe-area-inset-bottom)]' : '',
          )}
        >
          <Outlet />
          {isDownloading && (
            <DownloadProgress progress={progress} fileName={fileName} />
          )}
          <BackToTop />
        </main>

        {/* Footer */}
        <ClientFooter />
      </div>
    </>
  )
}

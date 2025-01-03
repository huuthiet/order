import { Outlet } from 'react-router-dom'

import { ClientHeader } from '@/components/app'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib'
import { DownloadProgress } from '@/components/app/progress'
import { useDownloadStore } from '@/stores'
import { ClientFooter } from './client-footer'

export default function ClientLayout() {
  const isMobile = useIsMobile()
  const { progress, fileName, isDownloading } = useDownloadStore()

  return (
    <div className="">
      {/* Main content */}
      <div className="">
        {/* Header */}
        <ClientHeader isMobile={isMobile} />

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
        </main>

        {/* Footer */}
        <ClientFooter />
      </div>
    </div>
  )
}

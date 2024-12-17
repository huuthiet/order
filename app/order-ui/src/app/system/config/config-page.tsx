import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { ScrollArea } from '@/components/ui'

export default function MenuManagementPage() {
  const { t } = useTranslation(['config'])

  return (
    <div className="flex h-full flex-row gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4">
            <span className="flex w-full items-center justify-start gap-1 text-lg">
              <SquareMenu />
              {t('config.title')}
            </span>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

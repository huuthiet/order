import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'
import moment from 'moment'

import { ScrollArea } from '@/components/ui'
import { useSpecificMenu } from '@/hooks'
import { ProductDetailSkeleton } from '@/components/app/skeleton'
import MenuItemCard from './menu-item-card'
import { useState } from 'react'
import { CartToggleButton } from '@/components/app/button'
import AddMenuItem from './add-menu-item'

export default function MenuDetailPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { t } = useTranslation(['menu'])
  const { slug } = useParams()
  const { data: menuDetail, isLoading } = useSpecificMenu({
    slug: slug as string,
  })

  const menuDetailData = menuDetail?.result

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-row gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div
          className={`px-4 transition-all duration-300 ease-in-out ${
            isCartOpen ? 'w-full' : 'w-full'
          }`}
        >
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-background pr-4">
            <div className="flex w-full flex-row items-center justify-end"></div>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <span className="flex w-full items-center gap-1 text-lg">
              <SquareMenu />
              {t('menu.title')}
              {' - '}
              {moment(menuDetailData?.date).format('DD/MM/YYYY')}
            </span>
            <CartToggleButton
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
            />
          </div>

          <div
            className={`mt-4 grid grid-cols-1 gap-4 ${isCartOpen ? 'md:grid-cols-2' : 'md:grid-cols-5'} `}
          >
            {menuDetailData?.menuItems.map((item) => (
              <MenuItemCard menuItem={item} />
            ))}
          </div>
        </div>
      </ScrollArea>
      <div
        className={`border-l bg-background transition-all duration-300 ease-in-out ${
          isCartOpen ? 'w-[50%]' : 'w-0 opacity-0'
        } sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        {isCartOpen && <AddMenuItem />}
      </div>
    </div>
  )
}

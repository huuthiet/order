import moment from 'moment'

import MenuList from './menu-list'
import { CurrentDateInput } from '@/components/app/input'
import { ScrollArea } from '@/components/ui'
import { useSpecificMenu } from '@/hooks'
import { useUserStore } from '@/stores'

export default function MenuPage() {
  const { userInfo } = useUserStore()
  function getCurrentDate() {
    return moment().format('YYYY-MM-DD')
  }
  const { data: specificMenu, isLoading } = useSpecificMenu({
    date: getCurrentDate(),
    branch: userInfo?.branch.slug,
  })

  return (
    <div className="flex flex-row gap-2 h-dvh">
      <div
        className={`flex pr-2 flex-col transition-all duration-300 ease-in-out w-full pl-2`}
      >
        {/* Fixed Header Section */}
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between py-3 pr-4">
          <CurrentDateInput menu={specificMenu?.result} />
        </div>

        {/* Scrollable Content Section */}
        <ScrollArea className="flex-1">
          {/* <div className='flex justify-center w-full'>
            <CarouselItem />
          </div> */}
          <MenuList
            menu={specificMenu?.result}
            isLoading={isLoading}
          />
        </ScrollArea>
      </div>
    </div>
  )
}

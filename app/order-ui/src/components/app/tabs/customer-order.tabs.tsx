import CustomerOrderTabsContent from '@/components/app/tabscontent/customer-order.tabscontent'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { useThemeStore } from '@/stores'
import { OrderStatus } from '@/types'
import { useTranslation } from 'react-i18next'

export default function CustomerOrderTabs() {
  const { getTheme } = useThemeStore()
  const { t } = useTranslation('profile')
  return (
    <Tabs defaultValue="all" className="flex flex-col w-full gap-4">
      <TabsList className={`sticky z-10 flex items-center gap-2 ${getTheme() === 'light' ? 'bg-white' : 'bg-black'} top-5`}>
        <TabsTrigger value="all" className="flex justify-center w-1/3">
          {t('profile.all')}
        </TabsTrigger>
        <TabsTrigger value="shipping" className="flex justify-center w-1/3">
          {t('profile.shipping')}
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex justify-center w-1/3">
          {t('profile.completed')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <CustomerOrderTabsContent status={OrderStatus.ALL} />
      </TabsContent>
      <TabsContent value="shipping">
        <CustomerOrderTabsContent status={OrderStatus.SHIPPING} />
      </TabsContent>
      <TabsContent value="completed">
        <CustomerOrderTabsContent status={OrderStatus.COMPLETED} />
      </TabsContent>
    </Tabs>
  )
}

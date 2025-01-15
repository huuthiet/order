import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { CustomerInfoTabsContent, CustomerNotificationTabsContent } from '@/components/app/tabscontent'
import CustomerOrderTabs from './customer-order.tabs'

export function CustomerProfileTabs() {
  const { t } = useTranslation(['profile'])
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid grid-cols-3 gap-3 mb-10 sm:grid-cols-6 lg:mb-0">
        <TabsTrigger value="info" className="flex justify-center">
          {t('profile.generalInfo')}
        </TabsTrigger>
        <TabsTrigger value="notification" className="flex justify-center">
          {t('profile.notification')}
        </TabsTrigger>
        <TabsTrigger value="history" className="flex justify-center">
          {t('profile.history')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="info" className="w-full p-0">
        <CustomerInfoTabsContent />
      </TabsContent>
      <TabsContent value="notification" className="w-full p-0">
        <CustomerNotificationTabsContent />
      </TabsContent>
      <TabsContent value="history" className="w-full p-0">
        <CustomerOrderTabs />
      </TabsContent>
    </Tabs>
  )
}

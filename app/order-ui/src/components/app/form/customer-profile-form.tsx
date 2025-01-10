import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { CustomerProfileCard } from '@/components/app/card'

export function CustomerProfileForm() {
  const { t } = useTranslation(['profile'])
  return (
    <div>
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-2 gap-3 sm:grid-cols-6">
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
          <CustomerProfileCard />
        </TabsContent>
        <TabsContent value="notification" className="w-full p-0">
          <div className="py-5 text-center text-[13px]">Không có thông báo</div>
        </TabsContent>
        <TabsContent value="history" className="w-full p-0">
          <div className="py-5 text-center text-[13px]">Không có đơn hàng</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

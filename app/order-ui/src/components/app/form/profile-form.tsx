import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { UserProfileCard } from '@/components/app/card'

export default function ProfileForm() {
  const { t } = useTranslation(['profile'])
  return (
    <div>
      <Tabs defaultValue="general-info" className="w-full">
        <TabsList className="gap-3">
          <TabsTrigger value="general-info">
            {t('profile.generalInfo')}
          </TabsTrigger>
          <TabsTrigger value="password-and-authentication">
            {t('account.passwordAndAuthentication')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general-info" className="w-full p-0">
          <UserProfileCard />
        </TabsContent>
        {/* <TabsContent value="password-and-authentication">
        </TabsContent> */}
      </Tabs>
    </div>
  )
}

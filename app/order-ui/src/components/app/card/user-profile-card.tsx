import { useTranslation } from 'react-i18next'

import { Input, Card, CardContent } from '@/components/ui'
import { ProfilePicture } from '@/components/app/avatar'
import { useProfile } from '@/hooks'
import { publicFileURL } from '@/constants'
import { UpdateProfileDialog } from '@/components/app/dialog'

export default function UserProfileCard() {
  const { t } = useTranslation(['profile'])
  const { data } = useProfile()

  const userProfile = data?.result
  const formFields = {
    firstName: (
      <div className="flex flex-col gap-1">
        <span className="text-normal font-beVietNam text-sm">
          {t('profile.firstName')}
        </span>
        <Input
          className="font-beVietNam"
          value={userProfile?.firstName}
          readOnly
        />
      </div>
    ),
    lastName: (
      <div className="flex flex-col gap-1">
        <span className="text-normal font-beVietNam text-sm">
          {t('profile.lastName')}
        </span>
        <Input
          className="font-beVietNam"
          value={userProfile?.lastName}
          readOnly
        />
      </div>
    ),
    email: (
      <div className="flex flex-col gap-1">
        <span className="text-normal font-beVietNam text-sm">
          {t('profile.email')}
        </span>
        <Input className="font-beVietNam" value={userProfile?.email} readOnly />
      </div>
    ),
    phonenumber: (
      <div className="flex flex-col gap-1">
        <span className="text-normal font-beVietNam text-sm">
          {t('profile.phoneNumber')}
        </span>
        <Input
          className="font-beVietNam"
          value={userProfile?.phonenumber}
          readOnly
        />
      </div>
    ),
    dob: (
      <div className="flex flex-col gap-1">
        <span className="text-normal font-beVietNam text-sm">
          {t('profile.dob')}
        </span>
        <Input className="font-beVietNam" value={userProfile?.dob} readOnly />
      </div>
    ),
    address: (
      <div className="flex flex-col gap-1">
        <span className="text-normal font-beVietNam text-sm">
          {t('profile.address')}
        </span>
        <Input
          className="font-beVietNam"
          value={userProfile?.address}
          readOnly
        />
      </div>
    ),
    branch: (
      <div className="flex flex-col gap-1">
        <span className="text-normal font-beVietNam text-sm">
          {t('profile.branch')}
        </span>
        <Input
          className="font-beVietNam"
          value={userProfile?.branch?.name}
          readOnly
        />
      </div>
    ),
  }
  return (
    <div>
      <Card className="border-none shadow-none">
        <CardContent className="flex flex-col gap-6 p-0">
          <div className="flex flex-row p-2">
            <ProfilePicture
              height={80}
              width={80}
              src={
                userProfile?.avatar
                  ? `${publicFileURL}/${userProfile.avatar}`
                  : 'https://github.com/shadcn.png'
              }
              //   onUpload={handleUploadProfilePicture}
            />
            <div className="ml-4 flex flex-col justify-center">
              <span className="text-md font-beVietNam font-semibold">
                {userProfile?.lastName} {userProfile?.firstName}
              </span>
              <div className="text-description flex items-center">
                {/* <span>{userProfile?.username}</span> */}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-md border">
            <div
              //   className={cn(
              //     'flex w-full items-center justify-between px-6 py-4',
              //     getTheme() === 'light' ? 'bg-gray-50' : '',
              //   )}
              className={
                'flex w-full items-center justify-between bg-muted-foreground/5 px-6 py-6'
              }
            >
              <span className="text-md font-beVietNam font-semibold">
                {t('profile.profile')}
              </span>
              <div className="flex gap-2">
                <UpdateProfileDialog userProfile={userProfile} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
              {Object.keys(formFields).map((key) => (
                <div key={key}>
                  {formFields[key as keyof typeof formFields]}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

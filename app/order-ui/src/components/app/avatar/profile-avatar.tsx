import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'
import { publicFileURL } from '@/constants'
import { useUserStore } from '@/stores'

export default function ProfileAvatar() {
  const { userInfo } = useUserStore()
  return (
    <Avatar>
      <AvatarImage src={
        userInfo?.image
          ? `${publicFileURL}/${userInfo?.image}`
          : 'https://github.com/shadcn.png'
      } alt="Profile Picture" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}

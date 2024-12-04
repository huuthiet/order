import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Pencil } from 'lucide-react'

interface ProfilePictureProps {
  height: number
  width: number
  src: string
  onUpload: (file: File) => void
}

export default function ProfilePicture({
  height,
  width,
  src,
  onUpload,
}: ProfilePictureProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className="relative" style={{ height, width }}>
      <Avatar
        style={{ height, width }}
        className="relative overflow-hidden border group"
      >
        <AvatarImage
          className="transition-all duration-300 ease-in-out rounded-full cursor-pointer group-hover:brightness-75"
          src={src}
          alt="Profile Picture"
          height={height}
          width={width}
        />
      </Avatar>

      <label
        htmlFor="profile-picture-upload"
        className="absolute bottom-0 p-1 rounded-full cursor-pointer right-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600"
      >
        <Pencil size={16} className="text-white" />
      </label>
      <input
        id="profile-picture-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

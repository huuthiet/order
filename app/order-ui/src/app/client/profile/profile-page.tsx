import { ScrollArea } from '@/components/ui'
import { ProfileForm } from '@/components/app/form'

export default function ProfilePage() {

  return (
    <div className="container flex flex-row h-full gap-2 mx-auto">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div
          className={`transition-all duration-300 ease-in-out w-full`}
        >
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 bg-background">
            <div className="w-full">
              <ProfileForm />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

import { Avatar } from '@/components/app/avatar'

export default function AppHeader() {
  return (
    <header className="fixed top-0 flex items-center justify-end w-full h-16 bg-red-200 border-b">
      <div className="flex items-center gap-4">
        <Avatar />
      </div>
    </header>
  )
}

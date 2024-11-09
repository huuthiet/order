import { Search } from 'lucide-react'

import { Input } from '@/components/ui'

export default function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
      <Input type="search" placeholder="Search..." className="pl-10" />
    </div>
  )
}

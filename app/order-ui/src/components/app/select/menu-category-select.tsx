import { CookingPot } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

export default function MenuCategorySelect() {
  return (
    <Select>
      <SelectTrigger className="flex w-[200px] items-center">
        <CookingPot className="h-4 w-4 text-muted-foreground" />
        <SelectValue
          className="ml-2 hidden text-muted-foreground sm:inline-block"
          placeholder="Chọn loại món"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel></SelectLabel> */}
          <SelectItem value="apple">Món nước</SelectItem>
          <SelectItem value="banana">Món tráng miệng</SelectItem>
          <SelectItem value="blueberry">Cơm</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

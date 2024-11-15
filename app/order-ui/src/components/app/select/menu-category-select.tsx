import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'
import { CookingPot } from 'lucide-react'

export default function MenuCategorySelect() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <CookingPot className="w-4 h-4 text-muted-foreground" />
        <SelectValue className="text-muted-foreground" placeholder="Chọn loại món" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel></SelectLabel> */}
          <SelectItem value="apple">Món nước</SelectItem>
          <SelectItem value="banana">Món tráng miêng</SelectItem>
          <SelectItem value="blueberry">Cơm</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

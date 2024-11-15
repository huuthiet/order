import { Calendar } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'

export default function DateSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[160px]">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <SelectValue className="text-muted-foreground" placeholder="Chọn thứ" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel></SelectLabel> */}
          <SelectItem value="apple">Thứ 2</SelectItem>
          <SelectItem value="banana">Thứ 3</SelectItem>
          <SelectItem value="blueberry">Thứ 4</SelectItem>
          <SelectItem value="grapes">Thứ 5</SelectItem>
          <SelectItem value="pineapple">Thứ 6</SelectItem>
          <SelectItem value="pineapple">Thứ 7</SelectItem>
          <SelectItem value="pineapple">Chủ nhật</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

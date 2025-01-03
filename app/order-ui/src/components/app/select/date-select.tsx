import { Calendar } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'

interface DateSelectProps {
  onChange?: (timeRange: string) => void
}

export default function DateSelect({ onChange }: DateSelectProps) {
  const handleSelectTimeRange = (timeRange: string) => {
    if (onChange) {
      onChange(timeRange)
    }
  }

  return (
    <Select onValueChange={handleSelectTimeRange}>
      <SelectTrigger className="w-[12rem] flex gap-1 shadow-none font-normal bg-white">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <SelectValue className="text-muted-foreground" placeholder="Chọn thời gian" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel></SelectLabel> */}
          <SelectItem value="day">Ngày</SelectItem>
          <SelectItem value="week">Tuần</SelectItem>
          <SelectItem value="month">Tháng</SelectItem>
          <SelectItem value="year">Năm</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

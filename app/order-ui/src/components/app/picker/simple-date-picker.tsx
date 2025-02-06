import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

import { cn } from "@/lib/utils"
import {
    Button, Calendar, Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui"

interface ISimpleDatePickerProps {
    onChange: (date: string) => void
}

export default function SimpleDatePicker({ onChange }: ISimpleDatePickerProps) {
    const { t } = useTranslation("menu")
    const [date, setDate] = React.useState<string>("")

    const handleDateChange = (selectedDate?: Date) => {
        if (selectedDate) {
            const formattedDate = format(selectedDate, "yyyy-MM-dd")
            setDate(formattedDate)
            onChange(formattedDate) // Gọi callback để cập nhật state ở cha
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {date ? date : <span>{t('menu.chooseDate')}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={handleDateChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

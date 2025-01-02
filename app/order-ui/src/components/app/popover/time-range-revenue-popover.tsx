import { useState } from "react";
import { MoveRight, Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui";
import { DatePicker } from "../picker";

interface TimeRangeDatePickerProps {
    onApply: (startDate: string, endDate: string) => void;
}

export default function TimeRangeDatePicker({ onApply }: TimeRangeDatePickerProps) {
    const { t } = useTranslation(["revenue"]);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleApply = () => {
        if (startDate && endDate) {
            // Chuyển đổi startDate và endDate thành định dạng 'yyyy-MM-dd'
            const start = new Date(startDate.split('/').reverse().join('-'));
            const end = new Date(endDate.split('/').reverse().join('-'));

            if (end < start) {
                alert(t("revenue.invalidDateRange"));
                return;
            }

            // Định dạng ngày về dạng yyyy-MM-dd
            const formattedStartDate = start.toISOString().split('T')[0];
            const formattedEndDate = end.toISOString().split('T')[0];

            onApply(formattedStartDate, formattedEndDate);

            // Đóng Popover và reset giá trị date về null
            setStartDate(null);
            setEndDate(null);
            setOpen(false); // Đóng Popover
        }
    };

    const validateDate = (date: Date) => date <= today;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Settings2 />
                    {t("revenue.dateRangeFilter")}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[24rem]">
                <div className="flex flex-col w-full gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{t("revenue.dateRange")}</h4>
                        <p className="text-sm text-muted-foreground">
                            {t("revenue.dateRangeDescription")}
                        </p>
                    </div>
                    <div className="grid items-center grid-cols-11 gap-2">
                        <div className="flex items-center col-span-5 gap-2">
                            <DatePicker
                                date={startDate}
                                onSelect={setStartDate}
                                validateDate={validateDate}
                            />
                        </div>
                        <MoveRight className="flex justify-center w-full col-span-1 icon" />
                        <div className="flex items-center col-span-5 gap-2">
                            <DatePicker
                                date={endDate}
                                onSelect={setEndDate}
                                validateDate={validateDate}
                            />
                        </div>
                    </div>
                    <Button className="" onClick={handleApply}>
                        {t("revenue.apply")}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

import { useState, useEffect } from "react";
import {
    Button,
    Input,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui";
import { Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePriceRangeStore } from "@/stores";

interface PriceRangeFilterProps {
    onApply: (minPrice: number, maxPrice: number) => void;
}

export default function PriceRangeFilter({ onApply }: PriceRangeFilterProps) {
    const { t } = useTranslation(["menu"]);
    const { setPriceRange, minPrice: storedMinPrice, maxPrice: storedMaxPrice } = usePriceRangeStore();
    const [minPrice, setMinPrice] = useState<number>(storedMinPrice);
    const [maxPrice, setMaxPrice] = useState<number>(storedMaxPrice);

    useEffect(() => {
        setMinPrice(storedMinPrice);
        setMaxPrice(storedMaxPrice);
    }, [storedMinPrice, storedMaxPrice]);

    const handleApply = () => {
        const min = Number(minPrice) || 0;
        const max = Number(maxPrice) || 0;
        setPriceRange(min, max); // Lưu giá trị vào store
        onApply(min, max); // Gọi callback để cập nhật dữ liệu bên ngoài
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <Settings2 />
                    {t("menu.priceRangeFilter")}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{t("menu.priceRange")}</h4>
                        <p className="text-sm text-muted-foreground">
                            {t("menu.priceRangeDescription")}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid items-center grid-cols-3 gap-4">
                            <Label htmlFor="minPrice">{t("menu.fromPrice")}</Label>
                            <Input
                                id="minPrice"
                                type="number"
                                placeholder="0"
                                className="h-8 col-span-2"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                            />
                        </div>
                        <div className="grid items-center grid-cols-3 gap-4">
                            <Label htmlFor="maxPrice">{t("menu.toPrice")}</Label>
                            <Input
                                id="maxPrice"
                                type="number"
                                placeholder="100000"
                                className="h-8 col-span-2"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                            />
                        </div>
                        <Button className="mt-2" onClick={handleApply}>
                            {t("menu.apply")}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

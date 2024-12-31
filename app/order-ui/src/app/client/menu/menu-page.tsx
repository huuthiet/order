import { useState, useEffect } from "react";
import moment from "moment";
import { CircleX } from "lucide-react";

import { usePriceRangeStore, useUserStore } from "@/stores";
import { useSpecificMenu } from "@/hooks";
import { MenuList } from "../menu";
import { CurrentDateInput } from "@/components/app/input";
import { BranchSelect } from "@/components/app/select";
import { PriceRangeFilter } from "@/components/app/popover";

export default function MenuPage() {
  const { userInfo } = useUserStore();
  const { minPrice, maxPrice, clearPriceRange } = usePriceRangeStore();
  const [branch, setBranch] = useState<string>(userInfo?.branch.slug || "");
  const [filters, setFilters] = useState({
    date: moment().format("YYYY-MM-DD"),
    branch,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
  });

  const { data: specificMenu, isLoading } = useSpecificMenu(filters);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    }));
  }, [minPrice, maxPrice]);

  const handleSelectBranch = (value: string) => {
    setBranch(value);
    setFilters((prev) => ({ ...prev, branch: value }));
  };

  return (
    <div className="container flex flex-col w-full px-2 mx-auto">
      <div className="flex flex-col">
        <div className="sticky z-10 flex items-start justify-start w-full gap-2 py-4 overflow-hidden overflow-x-auto bg-white -top-1 sm:items-center sm:justify-between sm:flex-row">
          <div className="flex w-2/3 gap-4 sm:w-auto">
            <div className="flex-shrink-0 w-full sm:w-auto">
              <CurrentDateInput menu={specificMenu?.result} />
            </div>
            {minPrice !== 0 && maxPrice !== 0 && (
              <div className="flex items-center flex-shrink-0 gap-1 border rounded-full border-primary bg-primary/10 text-primary">
                <span className="text-xs">{`${minPrice.toLocaleString("vi-VN")}đ`}</span>
                <span className="text-xs">đến</span>
                <span className="text-xs">{`${maxPrice.toLocaleString("vi-VN")}đ`}</span>
                <CircleX onClick={() => clearPriceRange()} />
              </div>
            )}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <BranchSelect onChange={handleSelectBranch} />
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <PriceRangeFilter />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start w-full h-screen">
          <div className="gap-4">
            <MenuList menu={specificMenu?.result} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

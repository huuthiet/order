import { useUserStore } from "@/stores";
import moment from "moment";
import { useSpecificMenu } from "@/hooks";
import { MenuList } from "../menu";
import { CurrentDateInput } from "@/components/app/input";
import { BranchSelect } from "@/components/app/select";
import { useState } from "react";

export default function MenuPage() {
  const { userInfo } = useUserStore()
  const [branch, setBranch] = useState<string>(userInfo?.branch.slug || '')
  function getCurrentDate() {
    return moment().format('YYYY-MM-DD')
  }

  const { data: specificMenu, isLoading } = useSpecificMenu({
    date: getCurrentDate(),
    branch,
  })

  const handleSelectBranch = (value: string) => {
    setBranch(value); // Update the branch state
  };
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col">
        {/* Thực đơn */}
        <div className="sticky top-0 z-10 flex flex-col items-start justify-start gap-2 p-4 sm:items-center sm:justify-between sm:flex-row">
          <CurrentDateInput menu={specificMenu?.result} />
          <BranchSelect onChange={handleSelectBranch} />
        </div>
        <div className="flex flex-col items-start w-full h-screen px-4">
          <div className="gap-4">
            <MenuList
              menu={specificMenu?.result}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useUserStore } from "@/stores";
import moment from "moment";
import { useSpecificMenu } from "@/hooks";
import { MenuList } from "../menu";
import { CurrentDateInput } from "@/components/app/input";

export default function MenuPage() {
  const { userInfo } = useUserStore()
  function getCurrentDate() {
    return moment().format('YYYY-MM-DD')
  }
  const { data: specificMenu, isLoading } = useSpecificMenu({
    date: getCurrentDate(),
    branch: userInfo?.branch.slug,
  })
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col">
        {/* Thực đơn */}
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between gap-2 p-4">
          <CurrentDateInput menu={specificMenu?.result} />
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

import moment from "moment";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui";
import { CoffeeBackground } from "@/assets/images";
import { useUserStore } from "@/stores";
import { useSpecificMenu } from "@/hooks";
import { MenuList } from "../menu";
import { ROUTE } from "@/constants";
import { StoreCarousel } from ".";

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
      <div className="flex flex-col gap-6">
        {/* Section 1: Hero */}
        <div
          className="grid items-center justify-center h-screen grid-cols-6"
          style={{
            backgroundImage: `url(${CoffeeBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="col-span-1" />
          <div className="col-span-2 text-center text-white">
            <div className="flex flex-col gap-2">
              <div className="text-5xl font-extrabold">TREND COFFEE</div>
              {/* <div className="text-4xl font-bold">DẪN ĐẦU PHONG CÁCH</div> */}
            </div>
            <p className="mt-4">
              Hương vị đẳng cấp, khơi nguồn cảm hứng cho mọi khoảnh khắc.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <NavLink to={ROUTE.CLIENT_MENU}>
                <Button>Thực đơn</Button>
              </NavLink>
              <Button variant="outline" className="text-white bg-transparent">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>

        </div>

        {/* Section 2: Sản phẩm bán chạy */}
        <div className="flex flex-col items-start w-full p-4 h-fit">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <div className="px-4 py-1 text-sm text-white border rounded-full border-primary bg-primary text-muted-foreground">Sản phẩm bán chạy</div>
              <div className="px-4 py-1 text-sm border rounded-full text-muted-foreground">Sản phẩm mới</div>
            </div>
            <NavLink to={ROUTE.CLIENT_MENU} className="flex items-center justify-center px-4 text-sm transition-all duration-200 rounded-md hover:bg-primary/20 hover:scale-105">
              Xem thêm
            </NavLink>
          </div>
          <div className="gap-4 mt-4">
            <MenuList
              menu={specificMenu?.result}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Section 3: Thông tin quán */}
        <div className="grid items-start w-full grid-cols-5 p-4">
          {/* <div className="grid w-full grid-cols-2"> */}
          <div className="flex justify-center col-span-2">
            <div className="flex flex-col items-start w-2/3 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-extrabold">
                  TREND Coffee
                </span>
                <span className="text-muted-foreground">
                  Nơi cuộc hẹn tròn đầy với Cà phê đặc sản, Món ăn đa bản sắc và Không gian cảm hứng.
                </span>
              </div>
              <NavLink to={ROUTE.CLIENT_MENU} className="flex text-sm transition-all duration-200 rounded-md hover:bg-primary/20 hover:scale-105">
                <Button>
                  Tìm hiểu thêm
                </Button>
              </NavLink>
            </div>
          </div>
          <div className="flex col-span-3">
            <div className="w-11/12">
              <StoreCarousel />
            </div>
          </div>

          {/* </div> */}
          {/* <div className="gap-4 mt-4">
            <MenuList
              menu={specificMenu?.result}
              isLoading={isLoading}
            />
          </div> */}
        </div>

        {/* Section 4: Thông tin thêm */}
        <div className="flex items-center justify-center h-screen text-white bg-gray-900">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Tìm hiểu thêm về chúng tôi</h2>
            <p className="mt-4">
              Chúng tôi cung cấp các loại cà phê chất lượng cao với nguồn gốc rõ
              ràng. Hãy ghé thăm cửa hàng của chúng tôi!
            </p>
            <Button className="mt-6">Liên hệ</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

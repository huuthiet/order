import { Button } from "@/components/ui";
import { CoffeeBackground } from "@/assets/images";
import { NavLink } from "react-router-dom";

export default function MenuPage() {
  return (
    <div className="w-full">
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
          <h1 className="text-5xl font-extrabold">COFFEE BUILD</h1>
          <h2 className="text-5xl font-bold">YOUR MIND</h2>
          <p className="mt-4">
            The coffee is brewed by first roasting the green coffee beans over
            hot coals in a brazier to sample.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button>Thực đơn</Button>
            <Button variant="outline" className="text-white bg-transparent">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </div>

      {/* Section 2: Sản phẩm bán chạy */}
      <div className="flex flex-col items-start h-screen p-4">
        <h2 className="text-3xl font-semibold">Sản phẩm bán chạy</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Thay thế bằng danh sách sản phẩm */}
          <div className="p-4 bg-white rounded shadow">Sản phẩm 1</div>
          <div className="p-4 bg-white rounded shadow">Sản phẩm 2</div>
          <div className="p-4 bg-white rounded shadow">Sản phẩm 3</div>
        </div>
      </div>

      {/* Section 3: Thông tin thêm */}
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
      <footer className="py-4 text-center text-white bg-black">
        <div className="container mx-auto">
          <p className="text-sm">
            © {new Date().getFullYear()} Coffee Shop. All rights reserved.
          </p>
          <div className="mt-2 space-x-4">
            <NavLink
              to="/privacy-policy"
              className="text-sm hover:underline"
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/terms-of-service"
              className="text-sm hover:underline"
            >
              Terms of Service
            </NavLink>
            <NavLink
              to="/contact-us"
              className="text-sm hover:underline"
            >
              Contact Us
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

import formatCurrency from "@/utils/formatShortCurrency";
import React from "react";
import { useTranslation } from "react-i18next";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const data = [{
    name: "Product 1",
    price: 100,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 2",
    price: 200,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 3",
    price: 300,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 4",
    price: 400,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 1",
    price: 100,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 2",
    price: 200,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 3",
    price: 300,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 4",
    price: 400,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 1",
    price: 100,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 2",
    price: 200,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 3",
    price: 300,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
}, {
    name: "Product 4",
    price: 400,
    image: "https://giadinh.mediacdn.vn/296230595582509056/2023/1/17/thuc-don-giam-can-1673969909330168328960.jpg",
},
]
export default function NewProduct(): React.ReactElement {
    const { t } = useTranslation('menu')
    return (
        <>
            <Swiper
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10, },
                    560: { slidesPerView: 2, spaceBetween: 30, },
                    1024: { slidesPerView: 4, spaceBetween: 20, },
                    1280: { slidesPerView: 5, spaceBetween: 15, },
                }}
                initialSlide={0}
                pagination={{
                    dynamicBullets: true,
                    clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="mySwiper w-full h-full"

            >
                {data.map((item, index) => (
                    <SwiperSlide key={index} className="w-full h-[90%] py-2">
                        <div className="flex h-full w-full flex-col rounded-xl border bg-white backdrop-blur-md transition-all duration-300 hover:scale-105">
                            {item.image ?
                                <img src={item.image} alt="product" className="object-cover w-full h-36 rounded-t-md" />
                                :
                                <div className="w-full h-24 rounded-t-md bg-muted/60" />
                            }
                            <div className="flex flex-1 flex-col justify-between space-y-1.5 p-2">
                                <div>
                                    <h3 className="text-lg font-bold line-clamp-1">{item.name}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-1">
                                    <div className="flex flex-col">
                                        {item.price > 0 ? (
                                            <div className="flex flex-col items-start justify-start gap-1">
                                                <span className="text-xs font-bold text-primary sm:text-lg">
                                                    {formatCurrency(item.price)}
                                                </span>
                                                <span className="text-[0.7rem] text-muted-foreground">
                                                    {t('menu.totalSold')}: {50}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-bold text-primary">
                                                {t('menu.contactForPrice')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}
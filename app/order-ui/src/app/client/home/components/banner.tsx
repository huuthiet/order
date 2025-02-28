// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { LandingPageBackground, LandingPageBackgroundMobile } from '@/assets/images';
import { useIsMobile } from '@/hooks';
import React from 'react';
import { IBanner } from '@/types';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ROUTE } from '@/constants';
import { publicFileURL } from '@/constants/env'

export default function SwiperBanner({ bannerData }: { bannerData: IBanner[] }): React.ReactElement {
    const isMobile = useIsMobile();
    return (
        <Swiper
            pagination={{
                dynamicBullets: true,
                clickable: true,
            }}
            initialSlide={1}
            loop
            modules={[Autoplay, Pagination, Navigation]}
            className='relative h-[70vh] w-full'
        >
            {bannerData?.map((banner, index) =>
                <SwiperSlide
                    key={index}
                    className='bg-cover bg-center w-full h-[95%] grid grid-cols-1 justify-center px-4 sm:grid-cols-6 sm:items-center sm:px-0'
                    style={{
                        backgroundImage: `url(${isMobile ? LandingPageBackgroundMobile : publicFileURL + "/" + banner.image || LandingPageBackground})`,
                    }}>
                    <div className="hidden col-span-1 sm:block" />
                    <div className="w-full col-span-2 mt-12 text-center text-white sm:mt-0">
                        <div className="flex flex-col gap-2">
                            <div className="text-4xl font-extrabold uppercase sm:text-4xl">
                                {banner?.title ? banner.title : 'HOMELAND Coffee'}
                            </div>
                        </div>
                        <p className="mt-4 text-sm sm:text-base">
                            {/* Hương vị đẳng cấp, khơi nguồn cảm hứng cho mọi khoảnh khắc. */}
                            {banner?.content ? banner.content.replace(/(<([^>]+)>)/gi, '')
                                .substring(0, 100) : 'Hương vị đẳng cấp, khơi nguồn cảm hứng cho mọi khoảnh khắc.'}

                        </p>
                        <div className="flex justify-center gap-4 mt-6 sm:flex-row">
                            <NavLink to={ROUTE.CLIENT_MENU}>
                                <Button className="w-full">Thực đơn</Button>
                            </NavLink>
                            <Button variant="outline" className="text-white bg-transparent">
                                Tìm hiểu thêm
                            </Button>
                        </div>
                    </div>
                    <div className="hidden col-span-1 sm:block" />
                </SwiperSlide>
            )}
        </Swiper>
    );
};
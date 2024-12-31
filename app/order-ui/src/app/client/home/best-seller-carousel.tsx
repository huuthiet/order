import { NavLink } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselApi,
    Button
} from "@/components/ui";

import { IProduct, ISpecificMenu } from "@/types";
import { publicFileURL, ROUTE } from "@/constants";
import { SkeletonMenuList } from "@/components/app/skeleton";

interface BestSellerCarouselProps {
    isLoading: boolean;
    menu?: ISpecificMenu
}

export default function BestSellerCarousel({ menu, isLoading }: BestSellerCarouselProps) {
    const [api, setApi] = useState<CarouselApi>();
    const { t } = useTranslation('menu');
    const [current, setCurrent] = useState(0);

    const getPriceRange = (variants: IProduct['variants']) => {
        if (!variants || variants.length === 0) return null

        const prices = variants.map((v) => v.price)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)

        return {
            min: minPrice,
            max: maxPrice,
            isSinglePrice: minPrice === maxPrice,
        }
    }

    const onSelect = useCallback(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
    }, [api]);

    useEffect(() => {
        if (!api) return;

        const intervalId = setInterval(() => {
            api.scrollNext();
        }, 6000); // Trượt mỗi 6 giây

        api.on("select", onSelect);

        return () => {
            clearInterval(intervalId);
            api.off("select", onSelect);
        };
    }, [api, onSelect]);

    if (isLoading) {
        return (
            <div
                className={`grid grid-cols-4 gap-3 py-4`}
            >
                {[...Array(4)].map((_, index) => (
                    <SkeletonMenuList key={index} />
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full gap-2">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                setApi={setApi}
                className="w-full"
            >
                <CarouselContent>
                    {menu?.menuItems.map((item) => (
                        <CarouselItem key={item.slug} className="basis-1/3 sm:basis-1/4">
                            <div className="w-full sm:p-2">
                                <NavLink
                                    key={item.slug}
                                    className="block w-full"
                                    to={`${ROUTE.CLIENT_MENU}/${item.slug}`}>
                                    <div
                                        key={item.slug}
                                        className="flex flex-col h-[12rem] sm:h-[20rem] w-full transition-all duration-300 bg-white border hover:scale-105 rounded-xl backdrop-blur-md"
                                    >
                                        {/* Image Section with Discount Tag */}
                                        <div className="relative">
                                            {item.product.image ? (
                                                <img
                                                    src={`${publicFileURL}/${item.product.image}`}
                                                    alt={item.product.name}
                                                    className="object-cover w-full h-16 sm:h-36 rounded-t-md"
                                                />
                                            ) : (
                                                <div className="w-full sm:h-36 h-28 rounded-t-md bg-muted/60" />
                                            )}
                                        </div>

                                        {/* Content Section - More compact */}
                                        <div className="flex flex-1 flex-col space-y-1.5  justify-between p-2">
                                            <div>
                                                <h3 className="text-sm font-bold sm:text-lg line-clamp-1">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-[0.5rem] sm:text-xs text-gray-500 line-clamp-2">
                                                    {item.product.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between gap-1">
                                                <div className="flex flex-col">
                                                    {item.product.variants.length > 0 ? (
                                                        <div className='flex flex-col items-start justify-start gap-1'>
                                                            <span className="text-xs font-bold sm:text-lg text-primary">
                                                                {(() => {
                                                                    const range = getPriceRange(item.product.variants)
                                                                    if (!range) return '0đ'
                                                                    return range.isSinglePrice
                                                                        ? `${range.min.toLocaleString('vi-VN')}đ`
                                                                        : `${range.min.toLocaleString('vi-VN')}đ - ${range.max.toLocaleString('vi-VN')}đ`
                                                                })()}
                                                            </span>
                                                            <span className='text-[0.7rem] text-muted-foreground'>
                                                                {t('menu.amount')}
                                                                {item.currentStock}/{item.defaultStock}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm font-bold text-primary">
                                                            {t('menu.contactForPrice')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {item.currentStock > 0 ? (
                                                <div className='flex items-end justify-center w-full'>
                                                    {/* <AddToCartDialog product={item.product} /> */}
                                                </div>
                                            ) : (
                                                <Button
                                                    className="flex items-center justify-center w-full py-2 text-sm font-semibold text-white bg-red-500 rounded-full"
                                                    disabled
                                                >
                                                    {t('menu.outOfStock')}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </NavLink>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <div className="flex gap-2 mt-4">
                {menu?.menuItems.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${current === index ? "bg-primary w-4" : "bg-gray-300"
                            }`}
                        onClick={() => api?.scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    );
}






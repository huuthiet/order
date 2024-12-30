import { useCallback, useEffect, useState } from "react";

import {
    Card,
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    // CarouselNext,
    // CarouselPrevious,
} from "@/components/ui";
import { publicFileURL } from "@/constants";

export default function ProductImageCarousel({
    images,
    onImageClick
}: {
    images: string[],
    onImageClick: (image: string) => void
}) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleImageClick = (image: string, index: number) => {
        setSelectedIndex(index);
        setCurrent(index);
        onImageClick(image);
    };

    const onSelect = useCallback(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
    }, [api]);

    useEffect(() => {
        if (!api) return;

        const intervalId = setInterval(() => {
            api.scrollNext();
        }); // Trượt mỗi 6 giây

        api.on("select", onSelect);

        return () => {
            clearInterval(intervalId);
            api.off("select", onSelect);
        };
    }, [api, onSelect]);

    return (
        <div className="flex flex-col items-center w-full gap-2">
            <Carousel
                opts={{
                    align: "start",
                }}
                setApi={setApi}
                className="w-full"
            >
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index} className="w-full basis-1/2 md:basis-1/3">
                            <div className="flex w-full p-1">
                                <Card
                                    className={`relative w-full cursor-pointer group transition-all duration-300 ease-in-out hover:ring-2 hover:ring-primary ${selectedIndex === index ? 'ring-2 ring-primary' : ''
                                        }`}
                                    onClick={() => handleImageClick(image, index)}
                                >
                                    <img
                                        src={`${publicFileURL}/${image}`}
                                        alt={`${index + 1}`}
                                        className="object-cover w-full rounded-md h-28"
                                    />
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="flex gap-2 mt-4">
                {images?.map((_, index) => (
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






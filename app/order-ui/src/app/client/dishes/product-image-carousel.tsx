import { useState } from "react";

import {
    Card,
    Carousel,
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
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleImageClick = (image: string, index: number) => {
        setSelectedIndex(index);
        onImageClick(image);
    };

    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full"
        >
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index} className="w-full md:basis-1/3">
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
    );
}






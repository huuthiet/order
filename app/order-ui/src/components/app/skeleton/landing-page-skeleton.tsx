import { Skeleton } from '@/components/ui'
import { SkeletonMenuList } from './Skeleton'
import { NavLink } from 'react-router-dom'
import { ROUTE } from '@/constants'

export default function LandingPageSkeleton() {
    return (
        <div className="flex flex-col w-full gap-6">
            {/* Hero Section Skeleton */}
            <div className="h-screen bg-muted/50">
                <div className="grid items-center h-full grid-cols-6">
                    <div className="col-span-1" />
                    <div className="flex flex-col items-center col-span-2 gap-4">
                        <Skeleton className="w-64 h-12" /> {/* Title */}
                        <Skeleton className="w-48 h-4" /> {/* Subtitle */}
                        <div className="flex gap-4 mt-4">
                            <Skeleton className="w-32 h-10 rounded-md" /> {/* Button */}
                            <Skeleton className="w-32 h-10 rounded-md" /> {/* Button */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Products Section Skeleton */}
            <div className='flex flex-col gap-2 p-4'>
                <div className="flex justify-between w-full">
                    <div className="flex gap-2">
                        <div className="px-4 py-1 text-sm text-white border rounded-full border-primary bg-primary text-muted-foreground">Sản phẩm bán chạy</div>
                        <div className="px-4 py-1 text-sm border rounded-full text-muted-foreground">Sản phẩm mới</div>
                    </div>
                    <NavLink to={ROUTE.CLIENT_MENU} className="flex items-center justify-center px-4 text-sm transition-all duration-200 rounded-md hover:bg-primary/20 hover:scale-105">
                        Xem thêm
                    </NavLink>
                </div>
                <div
                    className={`grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4`}
                >
                    {[...Array(8)].map((_, index) => (
                        <SkeletonMenuList key={index} />
                    ))}
                </div>
            </div>

            {/* Store Info Section Skeleton */}
            <div className="grid grid-cols-5 gap-8 p-4 bg-muted/50">
                <div className="flex justify-center col-span-2">
                    <div className="flex flex-col w-2/3 gap-4">
                        <Skeleton className="w-48 h-8" />
                        <Skeleton className="w-full h-20" />
                        <Skeleton className="w-32 h-10 rounded-md" />
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="w-11/12">
                        <Skeleton className="w-full h-[400px] rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Additional Info Section Skeleton */}
            <div className="flex items-center justify-center h-screen bg-muted/50">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Skeleton className="h-10 w-96" />
                    <Skeleton className="w-[500px] h-16" />
                    <Skeleton className="w-32 h-10 rounded-md" />
                </div>
            </div>
        </div>
    )
}

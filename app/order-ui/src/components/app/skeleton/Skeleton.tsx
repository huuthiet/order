import { Skeleton } from '@/components/ui'

export function SkeletonCart() {
  return (
    <div className="flex flex-col h-full bg-muted/50">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 bg-white shadow-sm">
        <Skeleton className="w-32 h-6 mb-4" />
        <div className="flex gap-3">
          <Skeleton className="w-24 h-10 rounded-full" />
          <Skeleton className="w-24 h-10 rounded-full" />
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl">
              <Skeleton className="w-[72px] h-[72px] rounded-lg" />
              <div className="flex-1">
                <Skeleton className="w-3/4 h-5 mb-2" />
                <Skeleton className="w-1/4 h-4" />
                <Skeleton className="w-1/3 h-4 mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="rounded-md w-7 h-7" />
                <Skeleton className="w-5 h-5" />
                <Skeleton className="rounded-md w-7 h-7" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-6 space-y-4">
          <Skeleton className="w-full h-10 rounded-lg" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-1/4 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t">
        <Skeleton className="w-full h-12 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonMenuList() {
  return (
    <div className="flex overflow-hidden bg-muted/50 rounded-xl">
      {/* Skeleton for the left side: Image and quantity buttons */}
      <div className="flex flex-col gap-3 w-[200px] p-2">
        {/* Image skeleton */}
        <Skeleton className="object-cover w-full rounded-lg h-4/5" />

        {/* Quantity buttons skeleton */}
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-6 text-center rounded" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      {/* Skeleton for the right side: Details */}
      <div className="flex flex-col flex-1 px-2 py-4 space-y-4">
        {/* Dish name skeleton */}
        <Skeleton className="w-3/4 h-6" />

        {/* Description skeleton */}
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />

        {/* Price skeleton */}
        <Skeleton className="w-1/2 h-5 mt-4" />

        {/* Size selector skeleton */}
        <div className="flex flex-row items-center gap-4 mt-4">
          <Skeleton className="w-1/5 h-5" />
          <div className="flex gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* Add to cart button skeleton */}
        <Skeleton className="w-full h-10 mt-6 rounded-full" />
      </div>
    </div>
  )
}

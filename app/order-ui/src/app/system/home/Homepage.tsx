import { SkeletonCard } from '@/components/app/skeleton'
import { useDishes } from '@/hooks'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui'
import MenuList from './menu-list'
import { CartContent } from '@/router/loadable'

export default function HomePage() {
  const { data, isLoading } = useDishes()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[...Array(6)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <p className="text-center">Không có dữ liệu món ăn</p>
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-2">
        <div className="pb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Home page</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <MenuList />
      </div>
      <div className="col-span-1 pl-2 border-l">
        <div className="fixed bg-red-200">
          <CartContent />
        </div>
      </div>
    </div>
  )
}

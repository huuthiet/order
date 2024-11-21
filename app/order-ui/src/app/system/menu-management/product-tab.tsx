import { DataTable } from '@/components/ui'
import { useProductColumns } from './DataTable/columns'
import { useProducts } from '@/hooks'
import { ProductActionOptions } from './DataTable/actions'
import { IProduct } from '@/types'
import { ROUTE } from '@/constants'
import { useNavigate } from 'react-router-dom'

export default function ProductTab() {
  const { data: products, isLoading } = useProducts()
  const navigate = useNavigate()
  const handleRowClick = (product: IProduct) => {
    navigate(`${ROUTE.STAFF_PRODUCT_DETAIL}/${product.slug}`)
  }
  return (
    <div className="flex flex-row gap-2 h-[calc(100vh-4rem)]">
      <DataTable
        columns={useProductColumns()}
        data={products?.result || []}
        isLoading={isLoading}
        pages={1}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        onRowClick={handleRowClick}
        actionOptions={ProductActionOptions}
      />
    </div>
  )
}

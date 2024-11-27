import { DataTable } from '@/components/ui'
import { useProductColumns } from './DataTable/columns'
import { useProducts } from '@/hooks'
import { ProductActionOptions } from './DataTable/actions'

export default function ProductTab() {
  const { data: products, isLoading } = useProducts()
  // const navigate = useNavigate()
  // const handleRowClick = (product: IProduct) => {
  //   navigate(`${ROUTE.STAFF_PRODUCT_DETAIL}/${product.slug}`)
  // }
  return (
    <div className="flex h-full flex-row gap-2">
      <DataTable
        columns={useProductColumns()}
        data={products?.result || []}
        isLoading={isLoading}
        pages={1}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        // onRowClick={handleRowClick}
        actionOptions={ProductActionOptions}
      />
    </div>
  )
}

import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import { DataTableColumnHeader, Checkbox } from '@/components/ui'
import { IProduct } from '@/types'
import { publicFileURL } from '@/constants'
import { menuItemStore } from '@/stores'

export const useProductColumns = (): ColumnDef<IProduct>[] => {
  const { t } = useTranslation(['product'])
  const { addMenuItem, removeMenuItem, menuItems } = menuItemStore.getState()
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            // Lấy danh sách các hàng hiện tại
            const rows = table.getRowModel().rows
            if (value) {
              rows.forEach((row) => {
                addMenuItem(row.original.slug) // Thêm vào store
              })
            } else {
              rows.forEach((row) => {
                removeMenuItem(row.original.slug) // Xoá khỏi store
              })
            }
            table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        // Kiểm tra trạng thái checkbox dựa trên slug trong store
        const slug = row.original.slug
        const isChecked = menuItems.includes(slug)

        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) => {
              if (value) {
                addMenuItem(slug) // Thêm vào store
              } else {
                removeMenuItem(slug) // Xoá khỏi store
              }
              row.toggleSelected(!!value)
            }}
            aria-label="Select row"
          />
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'image',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.image')} />
      ),
      cell: ({ row }) => {
        const image = row.getValue('image')
        return image ? (
          <img
            src={`${publicFileURL}/${image}`}
            className="w-20 rounded-md object-contain"
          />
        ) : null
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.name')} />
      ),
    },
    {
      accessorKey: 'slug',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.name')} />
      ),
    },
    {
      accessorKey: 'catalog.name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('product.catalog')} />
      ),
    },
    // {
    //   accessorKey: 'variants',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       className="min-w-[16rem]"
    //       title={t('product.variant')}
    //     />
    //   ),
    //   cell: ({ row }) => {
    //     const variants = row.original.variants // Lấy variants từ dữ liệu gốc
    //     return variants && variants.length > 0 ? (
    //       <ul className="space-y-1">
    //         {variants.map((variant) => (
    //           <li
    //             key={variant.slug}
    //             className="flex items-center justify-between py-1 border-b"
    //           >
    //             <div>
    //               <span className="font-medium">{variant.size?.name}</span> -{' '}
    //               <span className="text-sm text-muted-foreground">
    //                 {variant.size?.description || t('common.noDescription')}
    //               </span>
    //             </div>
    //             <span className="font-semibold text-primary">
    //               {variant.price.toLocaleString('vi-VN')}đ
    //             </span>
    //           </li>
    //         ))}
    //       </ul>
    //     ) : (
    //       <span className="text-muted-foreground">
    //         {t('product.noVariant')}
    //       </span>
    //     )
    //   },
    // },
    // {
    //   accessorKey: 'description',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader
    //       column={column}
    //       title={t('product.description')}
    //     />
    //   ),
    // },
  ]
}

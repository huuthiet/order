import { CustomerInformation, OrderItemList } from '@/app/system/order-management'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { IOrder } from '@/types'
import { useTranslation } from 'react-i18next'

interface IOrderItemDetailSheetProps {
  order?: IOrder
  isOpen: boolean
  onClose: () => void
}

export default function OrderItemDetailSheet({ order, isOpen, onClose }: IOrderItemDetailSheetProps) {
  const { t: tCommon } = useTranslation(['common'])
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Thông tin chi tiết</SheetTitle>
          {/* <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription> */}
        </SheetHeader>
        <div className='mt-4'>
          {order ? (
            <div className="flex flex-col gap-2">
              {/* Customer Information */}
              <CustomerInformation orderDetailData={order} />
              {/* Danh sách sản phẩm */}
              <OrderItemList orderDetailData={order} />
            </div>
          ) : (
            <p className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
              {tCommon('common.noData')}
            </p>
          )}
        </div>
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  )
}

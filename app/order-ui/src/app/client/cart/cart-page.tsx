import { CircleAlert, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { QuantitySelector } from '@/components/app/button'
import { ScrollArea } from '@/components/ui'
import {
  // PaymentMethodSelect,
  TableSelect,
} from '@/app/system/menu'
import { useCartItemStore } from '@/stores'
import { CartNoteInput } from '@/components/app/input'
import { CreateOrderDialog, DeleteCartItemDialog } from '@/components/app/dialog'
import { publicFileURL } from '@/constants'
import { IOrderType } from '@/types'
// import { useIsMobile } from '@/hooks'

export default function CartPage() {
  const { t } = useTranslation('menu')
  // const [isCartOpen] = useState(true)
  const { getCartItems, addOrderType } = useCartItemStore()
  // const isMobile = useIsMobile()
  // const isCollapsed = state === 'collapsed'
  const cartItems = getCartItems()

  const handleAddDeliveryMethod = (orderType: IOrderType) => {
    addOrderType(orderType)
  }

  return (
    <div
      className={`mb-10 flex flex-col w-full px-2`}
    >
      {/* <div className="sticky top-0 z-10 flex items-center justify-end gap-2 py-3">
        {isMobile && <CheckoutCartDrawer />}
      </div> */}

      <ScrollArea className="flex flex-col gap-2 pb-4">
        {/* Order type selection */}
        {cartItems && (
          <div className="z-30 grid w-full grid-cols-2 gap-2 p-4 bg-background">
            <div
              onClick={() => handleAddDeliveryMethod(IOrderType.AT_TABLE)}
              className={`flex cursor-pointer items-center justify-center py-1 text-sm transition-colors duration-200 ${getCartItems()?.type === IOrderType.AT_TABLE
                ? 'border-primary bg-primary text-white'
                : 'border'
                } rounded-full border-muted-foreground/40 text-muted-foreground hover:border-primary hover:bg-primary hover:text-white`}
            >
              {t('menu.dineIn')}
            </div>
            <div
              onClick={() => handleAddDeliveryMethod(IOrderType.TAKE_OUT)}
              className={`flex cursor-pointer items-center justify-center py-1 text-sm transition-colors duration-200 ${getCartItems()?.type === IOrderType.TAKE_OUT
                ? 'border-primary bg-primary text-white'
                : 'border'
                } rounded-full border-muted-foreground/40 text-muted-foreground hover:border-primary hover:bg-primary hover:text-white`}
            >
              {t('menu.takeAway')}
            </div>
          </div>
        )}
        {/* Table list order items */}
        <div className="mb-4">
          <div className="grid grid-cols-7 px-4 py-3 mb-4 text-sm font-thin rounded-md bg-muted/60">
            <span className="col-span-2">{t('order.product')}</span>
            <span className="col-span-2 text-center">
              {t('order.quantity')}
            </span>
            <span className="col-span-2 text-center">
              {t('order.grandTotal')}
            </span>
            <span className="flex justify-center col-span-1">
              <Trash2 size={18} />
            </span>
          </div>

          <div className="flex flex-col border rounded-md">
            {cartItems?.orderItems.map((item) => (
              <div
                key={item.slug}
                className="grid items-center w-full gap-4 p-4 pb-4 rounded-md"
              >
                <div
                  key={`${item.slug}`}
                  className="grid flex-row items-center w-full grid-cols-7"
                >
                  <div className="flex w-full col-span-2 gap-2">
                    <div className="flex flex-col items-center justify-start gap-2 sm:flex-row sm:justify-center">
                      <img
                        src={`${publicFileURL}/${item.image}`}
                        alt={item.name}
                        className="object-cover w-20 h-12 rounded-lg sm:h-16 sm:w-24"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold truncate sm:text-md">{item.name}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {`${(item.price || 0).toLocaleString('vi-VN')}đ`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center col-span-2">
                    <QuantitySelector cartItem={item} />
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-sm font-semibold text-primary">
                      {`${((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                  <div className="flex justify-center col-span-1">
                    <DeleteCartItemDialog cartItem={item} />
                  </div>
                </div>
                <CartNoteInput cartItem={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Checkout cart */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1">
            <CircleAlert size={14} className="text-destructive" />
            <span className='text-xs italic text-destructive'>{t('order.selectTableNote')}</span>
          </div>

        </div>

        {/* Table select */}
        <TableSelect />
        {/* {!isMobile && ( */}
        <div className="flex justify-end py-4">
          {/* <div className='w-1/2'> */}
          <CreateOrderDialog />
          {/* </div> */}
        </div>
        {/* )} */}
      </ScrollArea>
    </div>
  )
}

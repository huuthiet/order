import { CircleAlert, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { QuantitySelector } from '@/components/app/button'
import { TableSelect } from '@/app/system/menu'
import { useCartItemStore } from '@/stores'
import { CartNoteInput } from '@/components/app/input'
import {
  CreateOrderDialog,
  DeleteCartItemDialog,
} from '@/components/app/dialog'
import { publicFileURL } from '@/constants'
import { IOrderType } from '@/types'

export default function CartPage() {
  const { t } = useTranslation('menu')
  const { getCartItems, addOrderType } = useCartItemStore()
  const cartItems = getCartItems()

  const handleAddDeliveryMethod = (orderType: IOrderType) => {
    addOrderType(orderType)
  }

  return (
    <div className={`container my-10 w-full`}>
      {/* Order type selection */}
      {cartItems && (
        <div className="grid w-full max-w-xs grid-cols-2 gap-2">
          <div
            onClick={() => handleAddDeliveryMethod(IOrderType.AT_TABLE)}
            className={`flex cursor-pointer items-center justify-center py-1 text-sm transition-colors duration-200 ${
              getCartItems()?.type === IOrderType.AT_TABLE
                ? 'border-primary bg-primary text-white'
                : 'border'
            } rounded-full border-muted-foreground/40 text-muted-foreground hover:border-primary hover:bg-primary hover:text-white`}
          >
            {t('menu.dineIn')}
          </div>
          <div
            onClick={() => handleAddDeliveryMethod(IOrderType.TAKE_OUT)}
            className={`flex cursor-pointer items-center justify-center py-1 text-sm transition-colors duration-200 ${
              getCartItems()?.type === IOrderType.TAKE_OUT
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
        <div className="mb-4 grid grid-cols-7 rounded-md bg-muted/60 px-4 py-3 text-sm font-thin">
          <span className="col-span-2">{t('order.product')}</span>
          <span className="col-span-2 text-center">{t('order.quantity')}</span>
          <span className="col-span-2 text-center">
            {t('order.grandTotal')}
          </span>
          <span className="col-span-1 flex justify-center">
            <Trash2 size={18} />
          </span>
        </div>

        <div className="flex flex-col rounded-md border">
          {cartItems?.orderItems.map((item) => (
            <div
              key={item.slug}
              className="grid w-full items-center gap-4 rounded-md p-4 pb-4"
            >
              <div
                key={`${item.slug}`}
                className="grid w-full grid-cols-7 flex-row items-center"
              >
                <div className="col-span-2 flex w-full gap-2">
                  <div className="flex flex-col items-center justify-start gap-2 sm:flex-row sm:justify-center">
                    <img
                      src={`${publicFileURL}/${item.image}`}
                      alt={item.name}
                      className="h-12 w-20 rounded-lg object-cover sm:h-16 sm:w-24"
                    />
                    <div className="flex flex-col">
                      <span className="sm:text-md truncate text-xs font-bold">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground sm:text-sm">
                        {`${(item.price || 0).toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">
                  <QuantitySelector cartItem={item} />
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-sm font-semibold text-primary">
                    {`${((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                <div className="col-span-1 flex justify-center">
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
          <span className="text-xs italic text-destructive">
            {t('order.selectTableNote')}
          </span>
        </div>
      </div>

      {/* Table select */}
      <TableSelect />
      <div className="flex justify-end py-4">
        <div className="w-full sm:max-w-[10rem]">
          <CreateOrderDialog />
        </div>
      </div>
    </div>
  )
}

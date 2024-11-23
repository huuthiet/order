import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// import { CartContent } from '@/router/loadable'
import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { CartToggleButton, QuantitySelector } from '@/components/app/button'
import { useSidebar } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui'
import {
  CheckoutCart,
  PaymentMethodSelect,
  TableSelect,
} from '@/app/system/menu'
import { useCartItemStore } from '@/stores'
import { CartNoteInput } from '@/components/app/input'
import { DeleteCartItemDialog } from '@/components/app/dialog'
import { publicFileURL } from '@/constants'

export default function ConfirmOrderPage() {
  const { t } = useTranslation('menu')
  const [isCartOpen, setIsCartOpen] = useState(true)
  const { getCartItems } = useCartItemStore()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const subtotal = getCartItems().reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )
  console.log(subtotal)

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-row gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div
          className={`transition-all duration-300 ease-in-out${
            isCartOpen ? 'w-[70%]' : 'w-full'
          } ${isCollapsed ? 'pl-2' : 'pl-4'}`}
        >
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-background py-3 pr-4">
            <div className="flex w-full flex-row items-center justify-between">
              <BreadcrumbComponent />
              <CartToggleButton
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
              />
            </div>

            <div className="grid w-full grid-cols-5 rounded-md bg-muted/60 px-4 py-3 text-sm font-thin">
              <span className="col-span-2">{t('order.product')}</span>
              <span className="text-center">{t('order.quantity')}</span>
              <span className="text-center">{t('order.grandTotal')}</span>
              <span className="flex justify-center">
                <Trash2 size={18} />
              </span>
            </div>
            <div className="flex w-full flex-col rounded-md border">
              {getCartItems().map((item) => (
                <div
                  key={item.slug}
                  className="grid w-full items-center gap-4 rounded-md p-4 pb-4"
                >
                  <div className="grid w-full grid-cols-5 flex-row items-center">
                    <div className="col-span-2 flex w-full gap-2">
                      <div className="flex flex-row items-center justify-center gap-2">
                        <img
                          src={`${publicFileURL}/${item.image}`}
                          alt={item.name}
                          className="h-16 w-24 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="truncate font-bold">
                            {item.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {`${item.price.toLocaleString('vi-VN')}đ`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <QuantitySelector cartItem={item} />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-primary">
                        {`${subtotal.toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <DeleteCartItemDialog cartItem={item} />
                    </div>
                  </div>
                  <CartNoteInput cartItem={item} />
                </div>
              ))}
            </div>
            <TableSelect />
            <PaymentMethodSelect />
          </div>
        </div>
      </ScrollArea>

      {/* Cart Section - Fixed */}
      <div
        className={`border-l bg-background transition-all duration-300 ease-in-out ${
          isCartOpen ? 'w-[30%]' : 'w-0 opacity-0'
        } sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        {isCartOpen && <CheckoutCart />}
      </div>
    </div>
  )
}

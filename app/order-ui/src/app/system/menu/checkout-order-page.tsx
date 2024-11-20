import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// import { CartContent } from '@/router/loadable'
import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { CartToggleButton, QuantitySelector } from '@/components/app/button'
import { useSidebar } from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui'
import { CheckoutCart, PaymentMethodSelect, TableSelect } from '@/app/system/menu'
import { useCartItemStore } from '@/stores'
import { CartNoteInput } from '@/components/app/input'
import { DeleteCartItemDialog } from '@/components/app/dialog'

export default function ConfirmOrderPage() {
  const { t } = useTranslation('menu')
  const [isCartOpen, setIsCartOpen] = useState(true)
  const { getCartItems } = useCartItemStore()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="flex flex-row gap-2 h-[calc(100vh-4rem)]">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div
          className={`  transition-all duration-300 ease-in-out${
            isCartOpen ? 'w-[70%]' : 'w-full'
          } ${isCollapsed ? 'pl-2' : 'pl-4'}`}
        >
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 py-3 pr-4 bg-background">
            <div className="flex flex-row items-center justify-between w-full">
              <BreadcrumbComponent />
              <CartToggleButton isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
            </div>

            <div className="grid w-full grid-cols-5 px-4 py-3 text-sm font-thin rounded-md bg-muted/60">
              <span className="col-span-2">{t('order.product')}</span>
              <span className="text-center">{t('order.quantity')}</span>
              <span className="text-center">{t('order.grandTotal')}</span>
              <span className="flex justify-center">
                <Trash2 size={18} />
              </span>
            </div>
            <div className="flex flex-col w-full border rounded-md">
              {getCartItems().map((item) => (
                <div key={item.id} className="grid items-center w-full gap-4 p-4 pb-4 rounded-md">
                  <div className="grid flex-row items-center w-full grid-cols-5">
                    <div className="flex w-full col-span-2 gap-2">
                      <div className="flex flex-row items-center justify-center gap-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-24 h-16 rounded-lg"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold truncate">{item.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.price.toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <QuantitySelector cartItem={item} />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-primary">
                        {item.price.toLocaleString('vi-VN')} VND
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
        className={`transition-all duration-300 ease-in-out border-l bg-background ${
          isCartOpen ? 'w-[30%]' : 'w-0 opacity-0'
        } sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        {isCartOpen && <CheckoutCart />}
      </div>
    </div>
  )
}

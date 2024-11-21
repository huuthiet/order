import { NavLink } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button, ScrollArea } from '@/components/ui'
import { QuantitySelector } from '@/components/app/button'
import { CartNoteInput, PromotionInput } from '@/components/app/input'
import { useCartItemStore } from '@/stores'
import { publicFileURL, ROUTE } from '@/constants'

export default function CartContent() {
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation(['common'])
  const { getCartItems, removeCartItem } = useCartItemStore()

  // Tính tổng tiền của các món trong giỏ hàng
  const subtotal = getCartItems().reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  // Giả sử giảm giá là 0
  const discount = 0
  const total = subtotal - discount

  console.log(getCartItems())

  const handleRemoveCartItem = (slug: string) => {
    removeCartItem(slug)
  }

  return (
    <div className="flex h-full flex-col bg-transparent backdrop-blur-md">
      {/* Header */}
      <div className="px-4 pt-2">
        <h1 className="text-lg font-medium">{t('menu.order')}</h1>
      </div>

      {/* Cart Items */}
      <ScrollArea className="mt-2 flex-1">
        <div className="flex flex-1 flex-col gap-4 px-4 pb-8">
          <div className="flex flex-col gap-4 space-y-2 py-2">
            {getCartItems().length > 0 ? (
              getCartItems().map((item) => {
                const itemTotal = item.price * item.quantity // Thành tiền của từng món
                return (
                  <div
                    key={item.slug}
                    className="flex flex-col items-center gap-4 border-b pb-4"
                  >
                    <div className="flex w-full flex-1 flex-row items-center gap-2 rounded-xl">
                      <img
                        src={`${publicFileURL}/${item.image}`}
                        alt={item.name}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex flex-row items-start justify-between">
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-bold">
                              {item.name}
                            </span>
                            <span className="text-xs font-thin text-muted-foreground">
                              {`${item.price.toLocaleString('vi-VN')}đ`}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => handleRemoveCartItem(item.slug)}
                          >
                            <Trash2
                              size={20}
                              className="text-muted-foreground"
                            />
                          </Button>
                        </div>

                        <div className="flex w-full flex-1 items-center justify-between text-sm font-medium">
                          <QuantitySelector cartItem={item} />
                          <span className="font-semibold text-muted-foreground">
                            {`${itemTotal.toLocaleString('vi-VN')}đ`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CartNoteInput cartItem={item} />
                  </div>
                )
              })
            ) : (
              <p className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
                {tCommon('common.noData')}
              </p>
            )}
          </div>
          <PromotionInput />
        </div>
      </ScrollArea>

      {/* Order Summary and Checkout */}
      <div className="mt-auto border-t bg-background p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('menu.total')}</span>
            <span>{`${subtotal.toLocaleString('vi-VN')}đ`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('menu.discount')}</span>
            <span className="text-xs text-green-600">
              {' '}
              - {`${discount.toLocaleString('vi-VN')}đ`}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 font-medium">
            <span className="font-semibold">{t('menu.subTotal')}</span>
            <span className="text-lg font-bold text-primary">
              {`${total.toLocaleString('vi-VN')}đ`}
            </span>
          </div>
        </div>
        <NavLink to={ROUTE.STAFF_CHECKOUT_ORDER}>
          <Button
            disabled={!getCartItems().length}
            className="mt-4 w-full rounded-full bg-primary text-white"
          >
            {t('menu.continue')}
          </Button>
        </NavLink>
      </div>
    </div>
  )
}

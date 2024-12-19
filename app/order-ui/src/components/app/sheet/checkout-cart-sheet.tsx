import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  Label,
  ScrollArea,
} from '@/components/ui'
import { useCartItemStore } from '@/stores'
import { CreateOrderDialog } from '@/components/app/dialog'
import { CartNoteInput, PromotionInput } from '@/components/app/input'
import { publicFileURL } from '@/constants'

export default function CheckoutCartSheet() {
  const { t: tCommon } = useTranslation(['common'])
  const { t } = useTranslation('menu')

  const { getCartItems, removeCartItem } = useCartItemStore()
  const navigate = useNavigate()

  // Lấy dữ liệu từ store
  const cartItems = getCartItems()

  // Tính tổng tiền
  const subtotal = useMemo(() => {
    return cartItems?.orderItems.reduce((acc, orderItem) => {
      return acc + (orderItem.price || 0) * orderItem.quantity
    }, 0)
  }, [cartItems])

  const discount = 0
  const total = subtotal ? subtotal - discount : 0

  const handleRemoveCartItem = (orderItemId: string) => {
    removeCartItem(orderItemId)
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button disabled={!cartItems?.table || cartItems?.table === ""}>
          {t('order.confirmation')}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-primary">
            {t('order.orderInformation')}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full bg-transparent backdrop-blur-md">
          {/* Cart Items */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col flex-1 gap-4 pb-8">
              <div className="flex flex-col gap-4 py-2 space-y-2">
                {/* Customer Information */}
                {/* <div className="flex flex-col gap-4 pb-6 mt-6 border-b">
              <div className="flex flex-col gap-2">
                <Label>{t('order.customerName')}</Label>
                <Input placeholder={t('order.enterCustomerName')} />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('order.phoneNumber')}</Label>
                <Input placeholder={t('order.enterPhoneNumber')} />
              </div>
            </div> */}

                {/* Table Information */}
                <div className="flex flex-col gap-4 pb-6 mt-5 border-b">
                  <div className="flex flex-col gap-2">
                    <Label>{t('order.deliveryMethod')}</Label>
                    <div className="flex flex-row items-center gap-4">
                      <div className="flex items-center justify-center px-4 py-1 text-xs font-thin rounded-full w-fit bg-primary/15 text-primary">
                        {t('order.dineIn')}
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          {t('order.tableNumber')}: {cartItems?.tableName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                {cartItems?.orderItems.map((item) => (
                  <div
                    key={item.slug}
                    className="flex flex-col gap-4 pb-4 border-b"
                  >
                    <div
                      key={`${item.slug}`}
                      className="flex items-center w-full gap-2 rounded-xl"
                    >
                      <img
                        src={`${publicFileURL}/${item.image}`}
                        alt={item.name}
                        className="object-cover w-20 h-20 rounded-2xl"
                      />
                      <div className="flex flex-col flex-1 gap-2">
                        <div className="flex flex-row items-start justify-between">
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-bold truncate">
                              {item.name}
                            </span>
                            <span className="text-xs font-thin text-muted-foreground">
                              {`${(item.price || 0).toLocaleString('vi-VN')}đ`}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => handleRemoveCartItem(item.id)}
                          >
                            <Trash2
                              size={20}
                              className="text-muted-foreground"
                            />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between w-full text-sm font-medium">
                          <span>
                            {t('order.quantity')} {item.quantity}
                          </span>
                          <span className="font-semibold text-muted-foreground">
                            {`${((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <CartNoteInput cartItem={item} />
                  </div>
                ))}
              </div>
              <PromotionInput />
            </div>
          </ScrollArea>

          {/* Order Summary and Checkout */}
          <div className="py-4 mt-auto border-t bg-background">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('order.total')}
                </span>
                <span>{`${subtotal?.toLocaleString('vi-VN')}đ`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t('order.discount')}
                </span>
                <span className="text-xs text-green-600">
                  - {`${discount.toLocaleString('vi-VN')}đ`}
                </span>
              </div>
              <div className="flex flex-col justify-start pt-2 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">{t('order.grandTotal')}</span>
                  <span className="text-lg font-bold text-primary">
                    {`${total.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('order.vat')}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 mt-4">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate(-1)}
              >
                {tCommon('common.back')}
              </Button>
              <CreateOrderDialog disabled={!cartItems?.orderItems.length} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

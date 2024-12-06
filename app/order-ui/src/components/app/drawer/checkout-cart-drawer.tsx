'use client'

import { ShoppingCart } from 'lucide-react'
// import { Bar, BarChart, ResponsiveContainer } from 'recharts'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useTranslation } from 'react-i18next'
import { useCartItemStore } from '@/stores'
import { ScrollArea, Label } from '@/components/ui'
import { CartNoteInput, PromotionInput } from '@/components/app/input'
import { publicFileURL } from '@/constants'
// import { NavLink, useNavigate } from 'react-router-dom'
import { CreateOrderDialog } from '../dialog'

export default function CheckoutCartDrawer() {
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation(['common'])
  //   const navigate = useNavigate()
  const { getCartItems } = useCartItemStore()

  const cartItems = getCartItems()

  // Tính tổng tiền
  const subtotal = cartItems?.orderItems?.reduce((acc, orderItem) => {
    return acc + (orderItem.price || 0) * orderItem.quantity
  }, 0)

  const discount = 0 // Giả sử giảm giá là 0
  const total = subtotal ? subtotal - discount : 0

  return (
    <Drawer>
      <DrawerTrigger asChild className="z-30">
        <div>
          {cartItems?.orderItems && cartItems.orderItems.length > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center p-2 text-xs font-semibold text-white rounded-full h-7 w-7 bg-primary">
              {cartItems?.orderItems.length}
            </span>
          )}
          <Button variant="outline">
            <ShoppingCart className="icon" />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w-sm mx-auto">
          <DrawerHeader>
            <DrawerTitle>{t('order.orderInformation')}</DrawerTitle>
            <DrawerDescription>{t('menu.orderDescription')}</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[28rem]">
              {/* <div className="flex flex-col gap-4 p-4 mt-6 border-b">
                <div className="flex flex-col gap-2">
                  <Label>{t('order.customerName')}</Label>
                  <Input placeholder={t('order.enterCustomerName')} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t('order.phoneNumber')}</Label>
                  <Input placeholder={t('order.enterPhoneNumber')} />
                </div>
              </div> */}
              <div className="flex flex-col gap-4 p-4 mt-5 border-b">
                <div className="flex flex-col gap-2">
                  <Label>{t('order.deliveryMethod')}</Label>
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex items-center justify-center px-4 py-1 text-xs font-thin rounded-full w-fit bg-primary/15 text-primary">
                      {t('order.dineIn')}
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        {t('order.tableNumber')}: 8
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 py-2 space-y-2">
                  {cartItems ? (
                    cartItems?.orderItems?.map((item) => (
                      <div
                        key={item.slug}
                        className="flex flex-col gap-4 pb-4 border-b"
                      >
                        <div
                          key={`${item.slug}`}
                          className="flex flex-row items-center gap-2 rounded-xl"
                        >
                          {/* Hình ảnh sản phẩm */}
                          <img
                            src={`${publicFileURL}/${item.image}`}
                            alt={item.name}
                            className="object-cover w-20 h-20 rounded-2xl"
                          />
                          <div className="flex flex-col flex-1 h-20 gap-2 py-2">
                            <div className="flex flex-row items-start justify-between h-full">
                              <div className="flex flex-col justify-between flex-1 h-full min-w-0">
                                <span className="font-bold truncate">
                                  {item.name}
                                </span>
                                <span className="flex items-center justify-between text-xs font-thin text-muted-foreground">
                                  {`${(item.price || 0).toLocaleString('vi-VN')}đ`}
                                  <span className="text-muted-foreground">
                                    x1
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CartNoteInput cartItem={item} />
                      </div>
                    ))
                  ) : (
                    <p className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
                      {tCommon('common.noData')}
                    </p>
                  )}
                </div>
                <PromotionInput />
              </div>
            </ScrollArea>
          </div>
          <DrawerFooter>
            <div className="p-4 mt-auto border-t bg-background">
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
                    <span className="font-semibold">
                      {t('order.grandTotal')}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {`${total.toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('order.vat')}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid flex-row grid-cols-2 gap-2">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full rounded-full">
                  {tCommon('common.close')}
                </Button>
              </DrawerClose>
              {/* <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate(-1)}
              >
                {tCommon('common.back')}
              </Button> */}
              <CreateOrderDialog disabled={!cartItems?.orderItems.length} />
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

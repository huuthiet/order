'use client'

import * as React from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Button, ScrollArea } from '@/components/ui'
import { QuantitySelector } from '@/components/app/button'
import { CartNoteInput, PromotionInput } from '@/components/app/input'
import { useCartItemStore } from '@/stores'
import { Menu } from '@/constants'

export default function CartContent() {
  const { t } = useTranslation('menu')
  const [activeTab, setActiveTab] = React.useState<Menu.DINE_IN | Menu.TAKE_AWAY>(Menu.DINE_IN)
  const { getCartItems, removeCartItem } = useCartItemStore()
  const subtotal = getCartItems().reduce((acc, item) => acc + item.price * item.quantity, 0)
  const discount = 0
  const total = subtotal - discount

  const handleRemoveCartItem = (id: number) => {
    removeCartItem(id)
  }

  return (
    <div className="flex flex-col h-full bg-transparent backdrop-blur-md">
      {/* Header */}
      <div className="px-4 pt-2">
        <h1 className="text-lg font-medium">{t('menu.order')}</h1>
        <div className="flex gap-2 py-2">
          <Button
            onClick={() => setActiveTab(Menu.DINE_IN)}
            className={cn(
              'rounded-full flex-1 text-sm',
              activeTab === Menu.DINE_IN && 'bg-primary text-white'
            )}
          >
            {t('menu.dineIn')}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab(Menu.TAKE_AWAY)}
            className={cn(
              'flex-1 rounded-full text-sm',
              activeTab === Menu.TAKE_AWAY && 'bg-primary text-white'
            )}
          >
            {t('menu.takeAway')}
          </Button>
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col flex-1 gap-4 px-4 pb-8">
          <div className="flex flex-col gap-4 py-2 space-y-2">
            {getCartItems().map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-4 pb-4 border-b">
                <div className="flex flex-row items-center flex-1 w-full gap-2 rounded-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-20 h-20 rounded-2xl"
                  />
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex flex-row items-start justify-between">
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-bold truncate">{item.name}</span>
                        <span className="text-xs font-thin text-muted-foreground">
                          {item.price} VND
                        </span>
                      </div>
                      <Button variant="ghost" onClick={() => handleRemoveCartItem(item.id)}>
                        <Trash2 size={20} className="text-muted-foreground" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between flex-1 w-full text-sm font-medium">
                      <QuantitySelector />
                      <span className="font-semibold text-muted-foreground">
                        {item.price.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  </div>
                </div>
                <CartNoteInput />
              </div>
            ))}
          </div>
          <PromotionInput />
        </div>
      </ScrollArea>

      {/* Order Summary and Checkout */}
      <div className="p-4 mt-auto border-t bg-background">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('menu.total')}</span>
            <span>{subtotal.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between">
            <span className=" text-muted-foreground">{t('menu.discount')}</span>
            <span className="text-xs text-green-600">
              {' '}
              - {discount.toLocaleString('vi-VN')} VND
            </span>
          </div>
          <div className="flex justify-between pt-2 font-medium border-t">
            <span className="font-semibold">{t('menu.subTotal')}</span>
            <span className="text-lg font-bold text-primary">
              {total.toLocaleString('vi-VN')} VND
            </span>
          </div>
        </div>
        <Button className="w-full mt-4 text-white rounded-full bg-primary">
          {t('menu.continue')}
        </Button>
      </div>
    </div>
  )
}

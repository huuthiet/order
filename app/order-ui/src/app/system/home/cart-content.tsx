'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button, ScrollArea } from '@/components/ui'
import { QuantitySelector } from '@/components/app/button'
import { CartNoteInput, PromotionInput } from '@/components/app/input'

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  size: string
  quantity: number
}

export default function CartContent() {
  const [activeTab, setActiveTab] = React.useState<'restaurant' | 'takeaway'>('restaurant')
  const [cartItems] = React.useState<CartItem[]>([
    {
      id: 1,
      name: 'Bún bò',
      image: 'https://bizweb.dktcdn.net/100/489/006/files/cach-nau-bun-bo-gio-heo-2.jpg',
      price: 55000,
      size: 'S',
      quantity: 1
    },
    {
      id: 2,
      name: 'Bánh mì',
      image: 'https://static.vinwonders.com/production/banh-mi-sai-gon-2.jpg',
      price: 20000,
      size: 'S',
      quantity: 1
    }
  ])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = 0
  const total = subtotal - discount

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 pt-2">
        <h1 className="text-lg font-medium">Đơn hàng</h1>
        <div className="flex gap-2 py-2">
          <Button
            onClick={() => setActiveTab('restaurant')}
            className={cn(
              'rounded-full flex-1 text-sm',
              activeTab === 'restaurant' && 'bg-primary text-white'
            )}
          >
            Tại quán
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab('takeaway')}
            className={cn(
              'flex-1 rounded-full text-sm',
              activeTab === 'takeaway' && 'bg-primary text-white'
            )}
          >
            Mang đi
          </Button>
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col flex-1 gap-4 px-4 pb-8">
          <div className="flex flex-col gap-4 py-2 space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-4 pb-4 border-b">
                <div className="flex flex-row items-center flex-1 w-full gap-2 bg-white rounded-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-20 h-20 rounded-2xl"
                  />
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-bold truncate">{item.name}</span>
                      <span className="text-xs font-thin text-muted-foreground">
                        {item.price} VND
                      </span>
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
            <span className="text-muted-foreground">Tổng tiền hàng</span>
            <span>{subtotal.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between">
            <span className=" text-muted-foreground">Giảm giá trực tiếp</span>
            <span className="text-xs text-green-600">
              {' '}
              - {discount.toLocaleString('vi-VN')} VND
            </span>
          </div>
          <div className="flex justify-between pt-2 font-medium border-t">
            <span className="font-semibold">Tạm tính</span>
            <span className="text-lg font-bold text-primary">
              {total.toLocaleString('vi-VN')} VND
            </span>
          </div>
        </div>
        <Button className="w-full mt-4 text-white rounded-full bg-primary">Tiếp tục</Button>
      </div>
    </div>
  )
}

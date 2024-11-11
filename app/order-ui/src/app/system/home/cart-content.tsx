'use client'

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

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
      <div className="overflow-auto flex-1 px-4">
        <div className="py-2 space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-2 items-center p-2 bg-white rounded-xl">
              <img src={item.image} alt={item.name} className="object-cover w-16 h-16 rounded-lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <p className="text-xs text-gray-500">Size {item.size}</p>
                <div className="mt-1 font-medium text-[#F7941D] text-sm">
                  {item.price.toLocaleString('vi-VN')} VND
                </div>
              </div>
              <div className="flex gap-1 items-center">
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-4 text-sm text-center">{item.quantity}</span>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary and Checkout */}
      <div className="p-4 mt-auto border-t bg-background">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tổng tiền hàng</span>
            <span>{subtotal.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between">
            <span>Giảm giá trực tiếp</span>
            <span className="text-green-600">{discount.toLocaleString('vi-VN')} VND</span>
          </div>
          <div className="flex justify-between pt-2 font-medium border-t">
            <span>Tạm tính</span>
            <span className="text-[#F7941D]">{total.toLocaleString('vi-VN')} VND</span>
          </div>
        </div>
        <Button className="w-full mt-4 bg-[#F7941D] hover:bg-[#e88a19] text-white rounded-full">
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}

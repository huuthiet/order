'use client'

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-lg font-medium">Đơn hàng</h1>
        </div>
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('restaurant')}
            className={cn(
              'flex-1 px-4 py-2.5 text-sm font-medium text-gray-500 border-b-2 border-transparent',
              activeTab === 'restaurant' && 'text-[#F7941D] border-[#F7941D]'
            )}
          >
            Tại quán
          </button>
          <button
            onClick={() => setActiveTab('takeaway')}
            className={cn(
              'flex-1 px-4 py-2.5 text-sm font-medium text-gray-500 border-b-2 border-transparent',
              activeTab === 'takeaway' && 'text-[#F7941D] border-[#F7941D]'
            )}
          >
            Mang đi
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl">
              <div className="w-[72px] h-[72px] flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">Size {item.size}</p>
                <div className="mt-1 text-[#F7941D] font-medium">
                  {item.price.toLocaleString('vi-VN')} VND
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center text-gray-400 w-7 h-7 hover:text-gray-600">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-5 text-center">{item.quantity}</span>
                <button className="flex items-center justify-center text-gray-400 w-7 h-7 hover:text-gray-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Discount Code */}
        <div className="mt-6">
          <h2 className="mb-2 text-base font-medium">Mã giảm giá</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập mã giảm giá ở đây"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
            />
            <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              Áp dụng
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6">
          <h2 className="mb-2 text-base font-medium">Tạm tính</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span>{subtotal.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Giảm giá trực tiếp</span>
              <span className="text-green-600">{discount.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="flex justify-between pt-2 font-medium border-t">
              <span>Tạm tính</span>
              <span className="text-[#F7941D]">{total.toLocaleString('vi-VN')} VND</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="sticky bottom-0 p-4 bg-white border-t">
        <button className="w-full py-3 px-4 bg-[#F7941D] text-white font-medium rounded-full hover:bg-[#e88a19] transition-colors">
          Tiếp tục
        </button>
      </div>
    </div>
  )
}

import React from 'react'
import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui'
import { useCartItemStore } from '@/stores'
import { IOrderItem } from '@/types'

interface QuantitySelectorProps {
  cartItem: IOrderItem
}

export default function QuantitySelector({ cartItem }: QuantitySelectorProps) {
  const [quantity, setQuantity] = React.useState(cartItem.quantity)
  const { updateCartItemQuantity } = useCartItemStore()

  const handleIncrement = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1
      updateCartItemQuantity(cartItem.id, newQuantity)
      return newQuantity
    })
  }

  const handleDecrement = () => {
    setQuantity((prev) => {
      const newQuantity = Math.max(prev - 1, 1)
      updateCartItemQuantity(cartItem.id, newQuantity)
      return newQuantity
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        className="h-fit w-fit rounded-full border p-1 hover:bg-gray-100"
      >
        <Minus size={12} />
      </Button>
      <span className="w-4 text-center text-xs">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        className="h-fit w-fit rounded-full border p-1 hover:bg-gray-100"
      >
        <Plus size={12} />
      </Button>
    </div>
  )
}

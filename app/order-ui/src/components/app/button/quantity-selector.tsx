import React from 'react'
import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui'

export default function QuantitySelector() {
  const [quantity, setQuantity] = React.useState(1)

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        className="p-1 border rounded-full w-fit h-fit hover:bg-gray-100"
      >
        <Minus size={12} />
      </Button>
      <span className="w-4 text-xs text-center">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        className="p-1 border rounded-full w-fit h-fit hover:bg-gray-100"
      >
        <Plus size={12} />
      </Button>
    </div>
  )
}

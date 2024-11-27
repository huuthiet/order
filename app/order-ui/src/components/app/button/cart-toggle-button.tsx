import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui'

interface QuantityButtonProps {
  isCartOpen: boolean
  setIsCartOpen: (value: boolean) => void
}

export default function CartToggleButton({
  isCartOpen,
  setIsCartOpen,
}: QuantityButtonProps) {
  return (
    <div>
      <Button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="h-fit w-fit rounded-full p-2 text-white transition"
      >
        {isCartOpen ? <ChevronRight /> : <ChevronLeft />}
      </Button>
    </div>
  )
}

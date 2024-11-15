import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui'

interface QuantityButtonProps {
  isCartOpen: boolean
  setIsCartOpen: (value: boolean) => void
}

export default function CartToggleButton({ isCartOpen, setIsCartOpen }: QuantityButtonProps) {
  return (
    <div>
      <Button
        variant="outline"
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="p-2 transition rounded-full h-fit w-fit"
      >
        {isCartOpen ? (
          <ChevronRight className="text-muted-foreground" />
        ) : (
          <ChevronLeft className="text-muted-foreground" />
        )}
      </Button>
    </div>
  )
}

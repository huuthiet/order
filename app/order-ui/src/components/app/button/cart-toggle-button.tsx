import { Button } from '@/components/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
        className="p-2 text-white transition rounded-full shadow-none h-fit w-fit"
      >
        <span className="material-icons">
          {isCartOpen ? <ChevronRight /> : <ChevronLeft />}
        </span>
      </Button>
    </div>
  )
}

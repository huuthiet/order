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
        className="h-fit w-fit p-2 text-white transition"
      >
        Thêm món vào thực đơn
      </Button>
    </div>
  )
}

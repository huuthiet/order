import { Label } from '@/components/ui'
import { Input } from '@/components/ui/input'

export default function PromotionInput() {
  return (
    <div className="flex w-full flex-col items-start gap-2.5">
      <Label htmlFor="promotion">Mã giảm giá</Label>
      <div className="flex w-full flex-1 flex-row justify-between gap-2">
        <Input type="text" placeholder="Nhập mã giảm giá" />
      </div>
    </div>
  )
}

import { Label } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PromotionInput() {
  return (
    <div className="flex flex-col items-start w-full gap-2.5">
      <Label htmlFor="promotion">Mã giảm giá</Label>
      <div className="flex flex-row justify-between flex-1 w-full gap-2">
        <Input type="text" placeholder="Nhập mã giảm giá" />
        <Button type="submit">Áp dụng</Button>
      </div>
    </div>
  )
}

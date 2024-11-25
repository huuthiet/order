import { publicFileURL } from '@/constants'

interface MenuItemCardProps {
  image: string
  name: string
  description: string
  stock: number
  price?: number
}

export default function MenuItemCard({
  image,
  name,
  description,
  stock,
  price,
}: MenuItemCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border p-4 shadow-sm hover:shadow-md">
      <img
        src={`${publicFileURL}/${image}`}
        alt={name}
        className="h-40 w-full rounded-md object-cover"
      />
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-2 flex w-full justify-between text-sm font-medium">
        <span>Kho: {stock}</span>
        {price && (
          <span className="text-primary">{price.toLocaleString('vi-VN')}đ</span>
        )}
      </div>
    </div>
  )
}

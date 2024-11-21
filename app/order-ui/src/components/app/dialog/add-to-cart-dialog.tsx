import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShoppingCart } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui'

import { IProduct, IProductVariant } from '@/types'
import { useCartItemStore } from '@/stores'
import { publicFileURL } from '@/constants'

interface AddToCartDialogProps {
  product: IProduct
  trigger?: React.ReactNode
}

export default function AddToCartDialog({ product, trigger }: AddToCartDialogProps) {
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation(['common'])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(
    product.variants[0] || null
  )
  const { addCartItem } = useCartItemStore()

  const handleAddToCart = () => {
    if (!selectedVariant) return

    const cartItem = {
      ...product,
      selectedVariant,
      quantity: 1
    }

    addCartItem(cartItem)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex flex-row items-center justify-center gap-1 px-4 text-white rounded-full">
            <ShoppingCart size={12} />
            {t('menu.addToCart')}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[64rem]">
        <DialogHeader>
          <DialogTitle>{t('menu.confirmProduct')}</DialogTitle>
          <DialogDescription>{t('menu.confirmProductDescription')}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4">
          {/* Product Image */}
          <div className="relative col-span-2">
            {product.image ? (
              <img
                src={`${publicFileURL}/${product.image}`}
                alt={product.name}
                className="object-cover w-full rounded-md"
              />
            ) : (
              <div className="w-full rounded-md bg-muted/50" />
            )}
          </div>

          <div className="flex flex-col col-span-2 gap-4">
            {/* Product Details */}
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t('menu.selectSize')}
                </label>
                <Select
                  value={selectedVariant?.slug}
                  onValueChange={(value) => {
                    const variant = product.variants.find((v) => v.slug === value)
                    setSelectedVariant(variant || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('menu.selectSize')} />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.slug} value={variant.slug}>
                        {variant.size.name.toUpperCase()} - {variant.price.toLocaleString('vi-VN')}đ
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price */}
            <div className="text-lg font-bold text-primary">
              {t('menu.price')}
              {selectedVariant ? `${selectedVariant.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {tCommon('common.cancel')}
          </Button>
          <Button onClick={handleAddToCart} disabled={!selectedVariant}>
            {t('menu.addToCart')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShoppingCart } from 'lucide-react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'

import { IProduct, IProductVariant } from '@/types'
import { useCartItemStore } from '@/stores'
import { publicFileURL } from '@/constants'

interface AddToCartDialogProps {
  product: IProduct
  trigger?: React.ReactNode
}

export default function AddToCartDialog({
  product,
  trigger,
}: AddToCartDialogProps) {
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation(['common'])
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState<string>('')
  const [selectedVariant, setSelectedVariant] =
    useState<IProductVariant | null>(product.variants[0] || null)
  const { addCartItem } = useCartItemStore()

  const generateCartItemId = () => {
    return Date.now().toString(36)
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return

    const cartItem = {
      ...product,
      id: generateCartItemId(),
      note,
      //   selectedVariant,
      price: selectedVariant.price,
      size: selectedVariant.size.name,
      quantity: 1,
    }

    addCartItem(cartItem)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex flex-row items-center justify-center gap-1 rounded-full px-4 text-white">
            <ShoppingCart size={12} />
            {t('menu.addToCart')}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="px-0 sm:max-w-[64rem]">
        <DialogHeader className="px-6">
          <DialogTitle>{t('menu.confirmProduct')}</DialogTitle>
          <DialogDescription>
            {t('menu.confirmProductDescription')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[24rem] px-6">
          <div className="grid grid-cols-4 gap-4">
            {/* Product Image */}
            <div className="relative col-span-2">
              {product.image ? (
                <img
                  src={`${publicFileURL}/${product.image}`}
                  alt={product.name}
                  className="h-48 w-full rounded-md object-cover sm:h-64 lg:h-80"
                />
              ) : (
                <div className="w-full rounded-md bg-muted/50" />
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-6">
              {/* Product Details */}
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
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
                      const variant = product.variants.find(
                        (v) => v.slug === value,
                      )
                      setSelectedVariant(variant || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('menu.selectSize')} />
                    </SelectTrigger>
                    <SelectContent>
                      {product.variants.map((variant) => (
                        <SelectItem key={variant.slug} value={variant.slug}>
                          {variant.size.name.toUpperCase()} -{' '}
                          {variant.price.toLocaleString('vi-VN')}đ
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Price */}
              {/* <div className="text-lg font-bold text-primary">
              {t('menu.price')}
              {selectedVariant ? `${selectedVariant.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
            </div> */}

              {/* Note */}
              <div className="flex flex-col items-start space-y-2">
                <span className="text-sm">{t('menu.note')}</span>
                {/* <NotepadText size={28} className="text-muted-foreground" /> */}
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)} // Cập nhật state note khi người dùng nhập
                  placeholder={t('menu.enterNote')}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-end gap-3 px-6">
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
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, SquareMenu } from 'lucide-react'

import { Button, ScrollArea } from '@/components/ui'
import { useProductBySlug } from '@/hooks'
import { publicFileURL } from '@/constants'
import { ProductRating } from '.'
import { ProductDetailSkeleton } from '@/components/app/skeleton'
import { useState } from 'react'
import { NonPropQuantitySelector } from '@/components/app/button'
import { useCartItemStore, useUserStore } from '@/stores'
import { ICartItem, IOrderType, IProductVariant } from '@/types'

export default function ProductManagementPage() {
  const { t } = useTranslation(['product'])
  const { t: tMenu } = useTranslation(['menu'])
  const { slug } = useParams()
  const { getUserInfo } = useUserStore()

  const { data: product, isLoading } = useProductBySlug(slug as string)
  const { addCartItem } = useCartItemStore()

  const productDetail = product?.result
  const [size, setSize] = useState<string | null>(productDetail?.variants[0]?.size.name || null)
  const [price, setPrice] = useState<number | null>(productDetail?.variants[0]?.price || null)
  const [note, setNote] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(productDetail?.variants[0] || null)
  console.log(productDetail)

  const generateCartItemId = () => {
    return Date.now().toString(36)
  }

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  const handleSizeChange = (size: string, price: number) => {
    setSize(size)
    setPrice(price)
  }

  const handleQuantityChange = (quantity: number) => {
    setQuantity(quantity)
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return

    const cartItem: ICartItem = {
      id: generateCartItemId(),
      slug: productDetail?.slug || '',
      owner: getUserInfo()?.slug,
      type: IOrderType.AT_TABLE, // default value, can be modified based on requirements
      branch: getUserInfo()?.branch.slug, // get branch from user info
      orderItems: [
        {
          id: generateCartItemId(),
          slug: productDetail?.slug || '',
          image: productDetail?.image || '',
          name: productDetail?.name || '',
          quantity: 1,
          variant: selectedVariant.slug,
          price: selectedVariant.price,
          description: productDetail?.description || '',
          isLimit: productDetail?.isLimit || false,
          // catalog: productDetail?.catalog || null,
          note: note,
        },
      ],
      table: '', // will be set later via addTable
    }

    addCartItem(cartItem)
    // Reset states
    setNote('')
    setSelectedVariant(productDetail?.variants[0] || null)
  }

  return (
    <div className="flex flex-row h-full gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`pl-4 transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 pr-4">
            <div className="flex flex-col flex-1 w-full mt-1">
              <div className="flex flex-row items-center justify-between">
                <span className="flex items-center gap-1 text-lg">
                  <SquareMenu />
                  {t('product.productDetail')}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid w-full grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                  <div className="flex flex-col h-full col-span-1 gap-2">
                    {productDetail && (
                      <img
                        src={`${publicFileURL}/${productDetail.image}`}
                        alt={productDetail.name}
                        className="w-[calc(100%-1rem)] rounded-xl object-cover"
                      />
                    )}
                    {/* Product images */}
                    {/* <div className="grid grid-cols-4">
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="w-[calc(100%-1rem)] rounded-md object-cover"
                        />
                      )}
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="w-[calc(100%-1rem)] rounded-md object-cover"
                        />
                      )}
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="w-[calc(100%-1rem)] rounded-md object-cover"
                        />
                      )}
                      {productDetail && (
                        <img
                          src={`${publicFileURL}/${productDetail.image}`}
                          alt={productDetail.name}
                          className="w-[calc(100%-1rem)] rounded-md object-cover"
                        />
                      )}
                    </div> */}
                  </div>
                  <div className="flex flex-col col-span-1 gap-4">
                    {productDetail && (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <div>
                            <span className="text-3xl font-semibold">
                              {productDetail.name}
                            </span>
                          </div>
                          <div>
                            <span className="text-md text-muted-foreground">
                              {productDetail.description}
                            </span>
                          </div>
                          {price && (
                            <div className="text-2xl font-semibold text-primary">
                              {`${price.toLocaleString()}đ`}
                            </div>
                          )}
                          {/* Product Rating */}
                          <div className="mt-2">
                            <ProductRating rating={productDetail.rating} />
                          </div>
                        </div>
                        {productDetail.variants.length > 0 && (
                          <div className="flex flex-row items-center w-full gap-6">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {t('product.selectSize')}
                            </label>
                            <div className='flex flex-row items-center justify-start gap-2'>
                              {productDetail.variants.map((variant) => (
                                <div
                                  // variant="outline"
                                  className={`flex items-center justify-center w-10 h-10 p-2 border rounded-full ${size === variant.size.name ? 'bg-primary border-primary text-white' : 'bg-transparent'}`}
                                  key={variant.slug}
                                  onClick={() => handleSizeChange(variant.size.name, variant.price)}
                                >
                                  {variant.size.name.toUpperCase()}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {productDetail.variants.length > 0 && (
                          <div className="flex flex-row items-center w-full gap-6">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {t('product.selectQuantity')}
                            </label>
                            <div className='flex flex-row items-center justify-start gap-2'>
                              <NonPropQuantitySelector onChange={handleQuantityChange} />
                              <div>
                                {/* Số lượng có sẵn: {productDetail.} */}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={handleAddToCart} variant="outline" className='bg-transparent' disabled={!size || quantity <= 0}>
                        <ShoppingCart />
                        {tMenu('menu.addToCart')}
                      </Button>
                      <Button>
                        {tMenu('menu.buyNow')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

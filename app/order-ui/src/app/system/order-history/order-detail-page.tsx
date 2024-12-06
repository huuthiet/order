import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NotepadText, SquareMenu } from 'lucide-react'

import { Input, ScrollArea } from '@/components/ui'
import { useOrderBySlug } from '@/hooks'
import CustomerInformation from './customer-information'
import { ProgressBar } from '@/components/app/progress'
import { publicFileURL } from '@/constants'

export default function OrderDetailPage() {
    const { t } = useTranslation(['menu'])
    const { slug } = useParams()
    const { data: orderDetail } = useOrderBySlug(slug as string)
    return (
        <div className="flex flex-row flex-1 gap-2">
            <ScrollArea className="flex-1">
                <div className='flex flex-col gap-2'>
                    <div className="flex flex-col">
                        <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 bg-background">
                            <span className="flex items-center justify-start w-full gap-1 text-lg">
                                <SquareMenu />
                                {t('order.orderDetail')} <span className='text-muted-foreground'>#{orderDetail?.result?.slug}</span>
                            </span>
                        </div>
                    </div>
                    <ProgressBar step={orderDetail?.result.status} />
                    <CustomerInformation orderDetailData={orderDetail?.result} />
                    <ScrollArea className="flex flex-col gap-2 pb-4">
                        <div className="grid grid-cols-7 px-4 py-3 mb-4 text-sm font-thin rounded-md bg-muted/60">
                            <span className="col-span-2">{t('order.product')}</span>
                            <span className="col-span-1">{t('order.unitPrice')}</span>
                            <span className="col-span-2 text-center">
                                {t('order.quantity')}
                            </span>
                            <span className="col-span-2 text-center">
                                {t('order.grandTotal')}
                            </span>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="flex flex-col border rounded-md">
                            {orderDetail?.result.orderItems.map((item) => (
                                <div
                                    key={item.slug}
                                    className="grid items-center w-full gap-4 p-4 pb-4 rounded-md"
                                >
                                    <div
                                        key={`${item.slug}`}
                                        className="grid flex-row items-center w-full grid-cols-7"
                                    >
                                        <div className="flex w-full col-span-2 gap-2">
                                            <div className="flex flex-col items-center justify-start gap-2 sm:flex-row sm:justify-center">
                                                <img
                                                    src={`${publicFileURL}/${item.variant.product.image}`}
                                                    alt={item.variant.product.image}
                                                    className="object-cover w-20 h-12 rounded-lg sm:h-16 sm:w-24"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-bold truncate">{item.variant.product.name}</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {t('order.size')}{item.variant.size.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex col-span-1">
                                            <span className='text-sm text-muted-foreground'>
                                                {`${(item.variant.price || 0).toLocaleString('vi-VN')}đ`}
                                            </span>
                                        </div>
                                        <div className="flex justify-center col-span-2">
                                            <span className='text-sm text-muted-foreground'>{item.quantity}</span>
                                        </div>

                                        <div className="flex justify-center col-span-2">
                                            <span className="text-sm font-semibold text-center text-primary">
                                                {`${((item.variant.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                                            </span>
                                        </div>
                                    </div>

                                    {item.note && (
                                        <div className='flex flex-row items-center gap-2'>
                                            <NotepadText className="text-muted-foreground" />
                                            <Input value={item.note} />
                                        </div>
                                    )}
                                    <div className='flex justify-end'>
                                        <div className='flex flex-col justify-end w-1/3 gap-3'>
                                            <div className='grid grid-cols-3'>
                                                <div className='col-span-2 text-sm font-semibold text-muted-foreground'>
                                                    {t('order.total')}
                                                </div>
                                                <div className='col-span-1 text-sm text-right text-muted-foreground'>
                                                    {`${orderDetail.result.subtotal.toLocaleString('vi-VN')}đ`}

                                                </div>
                                            </div>
                                            <div className='grid grid-cols-3'>
                                                <div className='col-span-2 text-sm font-semibold text-muted-foreground'>
                                                    {t('order.totalPayment')}
                                                </div>
                                                <div className='col-span-1 text-xl font-semibold text-right text-primary'>
                                                    {`${orderDetail.result.subtotal.toLocaleString('vi-VN')}đ`}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </ScrollArea>
        </div>
    )
}

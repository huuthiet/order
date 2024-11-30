import { useTranslation } from 'react-i18next'
import { Clock, ShoppingCartIcon, SquareMenu } from 'lucide-react'
import moment from 'moment'

import { Input, ScrollArea, Button } from '@/components/ui'
import { useOrders } from '@/hooks'
import { useUserStore } from '@/stores'
import OrderStatusBadge from '@/components/app/badge/order-status-badge'

export default function OrderManagementPage() {
    const { t } = useTranslation(['menu'])
    // const { t: tCommon } = useTranslation(['common'])
    const { userInfo } = useUserStore()
    // const { addOrder, getOrder } = useOrderStore()
    // const { data: orderDetail } = useOrderBySlug(selectedOrderSlug)

    const { data } = useOrders({
        ownerSlug: '',
        branchSlug: userInfo?.branch.slug,
    })

    const orders = data?.result || []
    console.log(orders)

    // useEffect(() => {
    //     if (orderDetail?.result) {
    //         addOrder(orderDetail.result)
    //     }
    // }, [orderDetail, addOrder])
    return (
        <div className="flex flex-row flex-1 gap-2">
            <ScrollArea className="flex-1">
                <div className='flex flex-col gap-4'>
                    <div className="flex flex-col">
                        <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 bg-background">
                            <span className="flex items-center justify-start w-full gap-1 text-lg">
                                <SquareMenu />
                                {t('order.title')}
                            </span>
                        </div>
                    </div>
                    <div className='grid grid-cols-2'>
                        <div className='col-span-1'></div>
                        <div className='flex items-center justify-end col-span-1 gap-2'>
                            <Input placeholder="Tìm kiếm" />
                            <Button>Tìm kiếm</Button>
                        </div>
                    </div>
                    <div className='p-4 border rounded-md'>
                        {orders?.map((order) => (
                            <div
                                key={order.slug}
                                className="grid grid-cols-5 gap-4 px-2 py-4 border-b cursor-pointer"
                            >
                                <div className="justify-start col-span-1">
                                    <div className="flex items-center gap-2">
                                        <div className='flex items-center justify-center p-2 w-9 h-9 rounded-xl bg-primary/10'>
                                            <ShoppingCartIcon className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">
                                                {order.owner?.firstName} {order.owner?.lastName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{order.tableName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">
                                            {order.orderItems?.length} {t('order.item')}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {order.subtotal?.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center col-span-1">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {moment(order.createdAt).format('HH:mm DD/MM/YYYY')}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <OrderStatusBadge status={order.status} />
                                </div>
                                <div className="col-span-1">
                                    <Button variant="outline" className='border-primary text-primary hover:text-primary hover:bg-primary/10'>
                                        {t('order.viewDetail')}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

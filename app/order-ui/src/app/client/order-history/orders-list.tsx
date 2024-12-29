import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';


import { Button } from '@/components/ui';
import { useOrders, usePagination } from '@/hooks';
import { useUserStore } from '@/stores';
import { publicFileURL, ROUTE } from '@/constants';
import OrderStatusBadge from '@/components/app/badge/order-status-badge';
import { OrderStatus } from '@/types';
import { OrderHistorySkeleton } from '@/components/app/skeleton';

export default function OrderList({ filter }: { filter: OrderStatus }) {
    const { t } = useTranslation(['menu']);
    const navigate = useNavigate();
    const { userInfo } = useUserStore();
    const { pagination } = usePagination();

    const { data: order, isLoading } = useOrders({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        ownerSlug: userInfo?.slug,
        order: 'DESC',
        branchSlug: userInfo?.branch.slug,
        hasPaging: true,
        status: filter === OrderStatus.ALL ? undefined : filter,
    });

    const orderData = order?.result.items;

    if (isLoading) {
        return (
            <OrderHistorySkeleton />
        );
    }

    return (
        <div className="mb-4 ">
            {orderData?.length ? (
                orderData.map((orderItem) => (
                    <div
                        key={orderItem.slug}
                        className="mb-6 border rounded-md"
                    >
                        {/* Header: Thông tin đơn hàng */}
                        <div className="flex items-center justify-between px-4 py-4 border-b rounded-t-md">
                            <span className='text-xs text-muted-foreground'>
                                {moment(orderItem.createdAt).format('hh:mm:ss DD/MM/YYYY')}
                            </span>
                            <OrderStatusBadge order={orderItem} />
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="flex flex-col divide-y">
                            {orderItem.orderItems.map((product) => (
                                <div
                                    key={product.slug}
                                    className="grid items-center grid-cols-12 gap-2 p-4"
                                >
                                    <div className="relative col-span-4">
                                        <div className="relative w-full h-16 sm:w-1/2 sm:h-full">
                                            <img
                                                src={`${publicFileURL}/${product.variant.product.image}`}
                                                alt={product.variant.product.name}
                                                className="object-cover w-full h-full rounded-md"
                                            />
                                            <div className="absolute flex items-center justify-center text-xs text-white rounded-full -right-3 -bottom-2 w-7 h-7 sm:w-10 sm:h-10 bg-primary">
                                                x{product.quantity}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-span-6 px-4">
                                        <div className="font-semibold">
                                            {product.variant.product.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {(product.variant.size.name).toLocaleUpperCase()} - {`${product.variant.price.toLocaleString('vi-VN')}đ`}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span>
                                            {`${(product.variant.price * product.quantity).toLocaleString('vi-VN')}đ`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-col justify-end gap-2 p-4'>

                            <div className='flex items-center justify-between'>
                                <Button variant='outline' onClick={() => navigate(`${ROUTE.CLIENT_ORDER_HISTORY}/${orderItem.slug}`)}>{t('order.viewDetail')}</Button>
                                <div>
                                    {t('order.subtotal')}:&nbsp;
                                    <span className='font-semibold text-primary text-md sm:text-2xl'>{`${orderItem.subtotal.toLocaleString()}đ`}</span>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                {/* <Button variant='outline' className='ml-2'>{t('order.viewDetail')}</Button> */}
                            </div>
                        </div>

                        {/* Ghi chú và Thanh toán */}
                        {/* <div className="p-4 bg-muted-foreground/10 rounded-b-md">
                <div className="mb-2">
                  <span className="font-bold">{t('order.note')}: </span>
                </div>
                {orderItem.payment && (
                  <div>
                    <span className="font-bold">{t('order.paymentMethod')}: </span>
                    <span>{orderItem.payment.paymentMethod}</span>
                  </div>
                )}
              </div> */}
                    </div>
                ))
            ) : (
                <div className="text-center">{t('order.noOrders')}</div>
            )}
        </div>
    );
}

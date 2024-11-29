import { useTranslation } from 'react-i18next'
import { AlarmClock, Clock, ShoppingCartIcon, SquareMenu } from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'

import { Button, ScrollArea } from '@/components/ui'
import { useCreateOrderTracking, useOrderBySlug, useOrders } from '@/hooks'
import { useOrderStore, useUserStore } from '@/stores'
import { IOrder, IOrderType, OrderStatus } from '@/types'
import OrderStatusBadge from '@/components/app/badge/order-status-badge'
import { publicFileURL } from '@/constants'
import OrderItemDetail from './order-item-detail'
import { showToast } from '@/utils'

export default function OrderManagementPage() {
  const { t } = useTranslation(['menu'])
  const { userInfo } = useUserStore()
  const { mutate: createOrderTracking } = useCreateOrderTracking()
  const { getOrder, getSelectedItems, clearSelectedItems } = useOrderStore()

  const { data } = useOrders({
    ownerSlug: '',
    branchSlug: userInfo?.branch.slug,
  })

  const orders = data?.result || []
  const countPendingOrders = (orders: IOrder[]): number => {
    return orders.filter((order) => order.status === OrderStatus.PENDING).length
  }

  const sortedPendingOrders = orders.filter(
    (order) => order.status === OrderStatus.PENDING,
  )

  const pendingCount = countPendingOrders(orders)
  const currentOrders = getOrder()

  const [selectedOrderSlug, setSelectedOrderSlug] = useState<string>('')
  const { data: orderDetail } = useOrderBySlug(selectedOrderSlug)

  const handleOrderClick = (order: IOrder) => {
    setSelectedOrderSlug(order.slug)
    clearSelectedItems()
  }

  const orderDetailData = orderDetail?.result
  // console.log('Check order detail: ', orderDetailData)

  const handleCallStaff = () => {
    // console.log('Call staff', getSelectedItems())
    // const selectedOrderItems = getSelectedItems()
    // console.log(selectedOrderItems)
    // if (selectedOrderItems) {

    // }
    createOrderTracking({
      type: 'by-staff',
      trackingOrderItems: getSelectedItems().map(
        (item) => ({
          quantity: item.quantity,
          orderItem: item.slug,
        }),
        {
          onSuccess: () => {
            clearSelectedItems()
            showToast(t('toast.callStaffSuccess'))
          },
        },
      ),
    })
  }
  return (
    <div className="flex flex-1 flex-row gap-2">
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-background pb-4">
            <span className="flex w-full items-center justify-start gap-1 text-lg">
              <SquareMenu />
              {t('order.title')}
            </span>
          </div>
          <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-9">
            <div className="col-span-4 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex h-[8rem] min-w-[12rem] flex-col justify-between rounded-md border bg-primary p-6 text-white">
                  <div className="text-md flex flex-row items-center justify-between">
                    {t('order.totalOrders')}
                    <div className="flex h-fit w-fit items-center justify-center rounded-lg bg-white p-3">
                      <ShoppingCartIcon className="icon text-primary" />
                    </div>
                  </div>
                  <span className="flex h-full items-center text-3xl">
                    {orders.length}
                  </span>
                </div>
                <div className="flex h-[8rem] min-w-[12rem] flex-col justify-between rounded-md border p-6 text-muted-foreground">
                  <div className="text-md flex flex-row items-center justify-between">
                    {t('order.pendingOrders')}
                    <div className="flex h-fit w-fit items-center justify-center rounded-lg bg-green-100 p-3">
                      <AlarmClock className="icon text-green-500" />
                    </div>
                  </div>
                  <span className="flex h-full items-center text-3xl">
                    {pendingCount}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 rounded-md border py-4">
                <div className="flex w-full flex-col gap-2">
                  <span className="px-6 text-lg font-semibold text-muted-foreground">
                    {t('order.orderList')}
                  </span>
                  <ScrollArea className="max-h-[24rem] w-full flex-1 px-3">
                    <div className="flex flex-col gap-1">
                      {sortedPendingOrders.map((pendingOrder) => (
                        <div
                          onClick={() => handleOrderClick(pendingOrder)}
                          key={pendingOrder.slug}
                          className={`grid cursor-pointer grid-cols-4 ${currentOrders?.slug === pendingOrder.slug ? 'border border-primary bg-primary/10' : ''} flex-row items-center rounded-md px-2 py-3 transition-colors duration-200 hover:bg-primary/10`}
                        >
                          <div className="col-span-2 flex justify-start gap-4">
                            <div className="flex items-center justify-start rounded-lg bg-primary p-2.5">
                              <ShoppingCartIcon className="icon text-white" />
                            </div>
                            <div className="flex flex-col justify-start text-sm">
                              <span>
                                {pendingOrder.owner.firstName}{' '}
                                {pendingOrder.owner.lastName}
                              </span>
                              <div className="flex flex-row gap-1 text-xs text-muted-foreground/50">
                                <span>{pendingOrder.orderItems.length}</span>
                                {t('order.item')}
                              </div>
                            </div>
                          </div>
                          {/* <span className="text-sm">
                            {pendingOrder.tableName}
                          </span> */}
                          <span className="flex flex-row items-center justify-start gap-1 text-[0.5rem] text-muted-foreground/60">
                            <Clock size={12} />
                            {moment(pendingOrder.createdAt).format(
                              'hh:mm DD/MM/YYYY',
                            )}
                          </span>
                          <OrderStatusBadge status={pendingOrder.status} />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="col-span-5 flex flex-col gap-1 rounded-md border py-4">
              <span className="px-4 text-lg font-medium">
                {t('order.orderInformation')}
              </span>
              <div>
                {orderDetailData ? (
                  <div className="flex flex-col gap-2">
                    {/* Customer Information */}
                    <div className="grid grid-cols-2 gap-2 border-b-2 pb-6">
                      {/* Customer Information */}
                      <div className="col-span-1 flex flex-col gap-1 border-r-2 px-4 text-muted-foreground">
                        <div className="grid grid-cols-2">
                          <span className="col-span-1 text-xs font-semibold">
                            {t('order.customerName')}
                          </span>
                          <span className="col-span-1 text-xs">
                            {orderDetailData?.owner?.firstName}{' '}
                            {orderDetailData?.owner?.lastName}
                          </span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="col-span-1 text-xs font-semibold">
                            {t('order.orderDate')}
                          </span>
                          <span className="col-span-1 text-xs">
                            {moment(orderDetailData?.createdAt).format(
                              'hh:mm DD/MM/YYYY',
                            )}
                          </span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="col-span-1 text-xs font-semibold">
                            {t('order.phoneNumber')}
                          </span>
                          <span className="col-span-1 text-xs">
                            {orderDetailData?.owner?.phonenumber}
                          </span>
                        </div>
                      </div>
                      {/* Deliver Information */}
                      <div className="col-span-1 text-muted-foreground">
                        <div className="grid grid-cols-3">
                          <span className="col-span-2 text-xs font-semibold">
                            {t('order.deliveryMethod')}
                          </span>
                          <span className="col-span-1 text-xs">
                            {orderDetailData?.type === IOrderType.AT_TABLE
                              ? t('order.dineIn')
                              : t('order.takeAway')}
                          </span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="col-span-2 text-xs font-semibold">
                            {t('order.tableNumber')}
                          </span>
                          <span className="col-span-1 text-xs">
                            {orderDetailData?.tableName}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Danh sách sản phẩm */}
                    <div className="flex flex-col gap-1">
                      <span className="px-4 py-1 text-lg font-medium">
                        {t('order.orderDetail')}
                      </span>
                      <div className="flex w-full flex-col gap-2">
                        <ScrollArea className="h-[24rem] px-4">
                          {orderDetailData?.orderItems?.map((item) => (
                            <div
                              key={item.slug}
                              className="grid w-full items-center gap-4 border-b-2 py-4"
                            >
                              <div
                                key={`${item.slug}`}
                                className="grid w-full grid-cols-4 flex-row items-center"
                              >
                                <div className="col-span-2 flex w-full justify-start">
                                  <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
                                    <div className="relative">
                                      <img
                                        src={`${publicFileURL}/${item.variant.product.image}`}
                                        alt={item.variant.product.name}
                                        className="h-12 w-20 rounded-lg object-cover sm:h-16 sm:w-24"
                                      />
                                      <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white">
                                        x{item.quantity}
                                      </span>
                                    </div>

                                    <div className="flex h-full flex-col items-start">
                                      <span className="truncate font-bold">
                                        {item.variant.product.name}
                                      </span>

                                      <span className="text-sm text-muted-foreground">
                                        {`${(item.variant.price || 0).toLocaleString('vi-VN')}đ`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-span-2 flex justify-end">
                                  <span className="text-sm font-semibold text-primary">
                                    {`${((item.variant.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                                  </span>
                                </div>
                              </div>
                              {/* <div className="flex items-center gap-2">
                                <NotepadText
                                  size={24}
                                  className="text-muted-foreground"
                                />
                                <Input value={item.note} readOnly />
                              </div> */}
                              <OrderItemDetail order={item} />
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
                    {t('common.noData')}
                  </p>
                )}
              </div>
              <div className="flex w-full justify-end gap-2">
                <Button onClick={handleCallStaff}>
                  {t('order.callStaff')}
                </Button>
                <Button>{t('order.callRobot')}</Button>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

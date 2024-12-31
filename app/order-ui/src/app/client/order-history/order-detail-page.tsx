import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'
import moment from 'moment'

import {
  Button,
  Separator,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { useOrderBySlug } from '@/hooks'
import { publicFileURL } from '@/constants'
import OrderStatusBadge from '@/components/app/badge/order-status-badge'
import { IOrderType } from '@/types'
import PaymentStatusBadge from '@/components/app/badge/payment-status-badge'
// import { ProgressBar } from '@/components/app/progress'

export default function OrderDetailPage() {
  const { t } = useTranslation(['menu'])
  const { slug } = useParams()
  const { data: orderDetail } = useOrderBySlug(slug as string)
  const navigate = useNavigate()

  return (
    <div className="mb-10">
      <div className="flex flex-col gap-2">
        {/* Title */}
        <div className="sticky z-10 flex flex-col items-center gap-2 py-2 bg-white -top-1">
          <span className="flex items-center justify-start w-full gap-1 text-lg">
            <SquareMenu />
            {t('order.orderDetail')}{' '}
            <span className="text-muted-foreground">
              #{orderDetail?.result?.slug}
            </span>
          </span>
        </div>
        {/* <ProgressBar step={orderDetail?.result.status} /> */}

        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Left, info */}
          <div className="flex flex-col w-full gap-4 lg:w-3/4">
            {/* Order info */}
            <div className="flex items-center justify-between p-3 border rounded-sm border-muted-foreground/30">
              <div className="">
                <p className="flex items-center gap-2 pb-2">
                  <span className="font-bold">Đơn hàng:</span>{' '}
                  <span className="text-primary">
                    {orderDetail?.result?.slug}
                  </span>
                  <OrderStatusBadge order={orderDetail?.result || undefined} />
                </p>
                <div className="flex flex-col gap-1 text-sm font-thin sm:items-center sm:flex-row">
                  <p>
                    Thời gian đặt hàng: {' '}
                    <span className='text-muted-foreground'>
                      {moment(orderDetail?.result?.createdAt).format(
                        'hh:mm:ss DD/MM/YYYY',
                      )}
                    </span>
                  </p>{' '}
                  <div className='hidden sm:block'>
                    |
                  </div>
                  <p className="flex items-center gap-1">
                    <span>Thu ngân:</span>
                    <span className="text-muted-foreground">
                      {`${orderDetail?.result?.owner?.firstName} ${orderDetail?.result?.owner?.lastName} (${orderDetail?.result?.owner?.phonenumber})`}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* Order owner info */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="border rounded-sm sm:grid-cols-2 border-muted-foreground/30">
                <div className="px-3 py-2 font-bold bg-muted-foreground/10">
                  Khách hàng
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm text-muted-foreground">
                    {`${orderDetail?.result?.owner?.firstName} ${orderDetail?.result?.owner?.lastName} (${orderDetail?.result?.owner?.phonenumber})`}
                  </p>
                </div>
              </div>
              <div className="border rounded-sm sm:grid-cols-2 border-muted-foreground/30">
                <div className="px-3 py-2 font-bold bg-muted-foreground/10">
                  Loại đơn hàng
                </div>
                <div className="px-3 py-2 text-sm">
                  <p>
                    {orderDetail?.result?.type === IOrderType.AT_TABLE
                      ? t('order.dineIn')
                      : t('order.takeAway')} - {t('order.tableNumber')}{' '} {orderDetail?.result?.table?.name}
                  </p>
                </div>
              </div>
            </div>
            {/* Order table */}
            <div className="overflow-x-auto">
              <Table className="min-w-full border border-collapse table-auto border-muted-foreground/20">
                <TableCaption>A list of orders.</TableCaption>
                <TableHeader className="rounded bg-muted-foreground/10">
                  <TableRow>
                    <TableHead className="">{t('order.product')}</TableHead>
                    <TableHead className="text-right">
                      {t('order.unitPrice')}
                    </TableHead>
                    <TableHead className="text-right">
                      {t('order.grandTotal')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetail?.result.orderItems?.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell className="flex flex-col gap-3 font-bold sm:flex-row sm:items-center">
                        <div className="relative col-span-4">
                          <div className="relative w-5/6 h-20 sm:w-1/2 sm:h-full">
                            <img
                              src={`${publicFileURL}/${item.variant.product.image}`}
                              alt={item.variant.product.name}
                              className="object-cover w-full h-full rounded-md"
                            />
                            <div className="absolute flex items-center justify-center text-xs text-white rounded-full -right-3 -bottom-2 w-7 h-7 sm:w-10 sm:h-10 bg-primary">
                              x{item.quantity}
                            </div>
                          </div>
                        </div>
                        <span className='text-xs sm:text-sm'>{item.variant.product.name} - Size {(item.variant.size.name).toUpperCase()}</span>
                      </TableCell>
                      {/* <TableCell className='text-center'>{item.quantity}</TableCell> */}
                      <TableCell className="text-right">
                        {`${orderDetail.result.subtotal.toLocaleString('vi-VN')}đ`}
                      </TableCell>
                      <TableCell className="text-right">
                        {`${((item.variant.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right, payment*/}
          <div className="flex flex-col w-full gap-2 lg:w-1/4">
            {/* Payment method, status */}
            <div className="border rounded-sm border-muted-foreground/30">
              <div className="px-3 py-2 font-bold bg-muted-foreground/10">
                Phương thức thanh toán
              </div>
              <div className="px-3 py-2">
                <p className="flex items-center gap-1 pb-2">
                  <span className="col-span-1 text-sm font-semibold">
                    {t('paymentMethod.title')}
                  </span>
                  <span className="text-sm">
                    {orderDetail?.result?.payment?.paymentMethod && (
                      <>
                        {orderDetail?.result?.payment.paymentMethod ===
                          'bank-transfer' && (
                            <span>{t('paymentMethod.bankTransfer')}</span>
                          )}
                        {orderDetail?.result?.payment.paymentMethod ===
                          'cash' && <span>{t('paymentMethod.cash')}</span>}
                      </>
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-1">
                  {/* <span className="col-span-1 text-sm font-semibold">
                    {t('paymentMethod.status')}
                  </span> */}
                  <span className="col-span-1 text-sm">
                    {orderDetail?.result?.payment && (
                      <PaymentStatusBadge
                        status={orderDetail?.result?.payment?.statusCode}
                      />
                    )}
                  </span>
                </p>
              </div>
            </div>
            {/* Total */}
            <div className="flex flex-col gap-2 p-2 border rounded-sm border-muted-foreground/30">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Tạm tính</p>
                <p>{`${(orderDetail?.result?.subtotal || 0).toLocaleString('vi-VN')}đ`}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Thành tiền</p>
                <p>{`${(orderDetail?.result?.subtotal || 0).toLocaleString('vi-VN')}đ`}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Cần thanh toán</p>
                <p className="text-2xl font-bold text-primary">{`${(orderDetail?.result?.subtotal || 0).toLocaleString('vi-VN')}đ`}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  ({orderDetail?.result?.orderItems?.length} sản phẩm)
                </p>
                <p className="text-xs text-muted-foreground">(Đã bao gồm VAT)</p>
              </div>
            </div>
            {/* Return order button */}
            <Button
              className="w-full bg-primary"
              onClick={() => {
                navigate('/order-history')
              }}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
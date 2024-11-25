import { useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { Button, ScrollArea } from '@/components/ui'
import { useInititateQrCode, useOrderBySlug } from '@/hooks'
import { PaymentMethodSelect } from '@/app/system/payment'
import { publicFileURL } from '@/constants'
import { QrCodeDialog } from '@/components/app/dialog'

export default function PaymentPage() {
  const { t } = useTranslation(['menu'])
  const { slug } = useParams()
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const { data: order } = useOrderBySlug(slug as string)
  const { mutate: inititateQrCode } = useInititateQrCode()
  const [qrCode, setQrCode] = useState<string>('')

  // Tạo biến để kiểm tra trạng thái nút xác nhận
  const isDisabled = !paymentMethod || !slug

  // Xử lý chọn phương thức thanh toán
  const handleSelectPaymentMethod = (selectedPaymentMethod: string) => {
    setPaymentMethod(selectedPaymentMethod)
  }

  // Xử lý xác nhận thanh toán
  const handleConfirmPayment = () => {
    if (!slug || !paymentMethod) return

    setQrCode('')

    inititateQrCode(
      { orderSlug: slug, paymentMethod },
      {
        onSuccess: (data) => {
          setQrCode(data.result.qrCode)
        },
      },
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-row gap-2">
      <ScrollArea className="flex-1">
        <div className={`px-4 transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-background py-3 pr-4">
            <div className="flex w-full flex-row items-center justify-between py-2">
              <BreadcrumbComponent />
            </div>
            <div className="flex w-full flex-col gap-3">
              {order && (
                <div className="w-full space-y-2">
                  {/* Thông tin khách hàng */}
                  <div className="grid grid-cols-2 items-center justify-between rounded-sm border p-4">
                    <div className="col-span-1 flex flex-col gap-1 border-r px-4">
                      <div className="grid grid-cols-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.customerName')}
                        </h3>
                        <p className="text-sm font-semibold">{`${order.result.owner.lastName} ${order.result.owner.firstName}`}</p>
                      </div>
                      <div className="grid grid-cols-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.orderDate')}
                        </h3>
                        <span className="text-sm font-semibold">
                          {moment(order.result.createdAt).format(
                            'HH:mm DD/MM/YYYY',
                          )}
                        </span>
                      </div>
                      <div className="grid grid-cols-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.phoneNumber')}
                        </h3>
                        <p className="text-sm font-semibold">
                          {order.result.owner.phonenumber}
                        </p>
                      </div>
                    </div>
                    {/* Thông tin vận chuyển */}
                    <div className="col-span-1 flex flex-col gap-1 border-r px-4">
                      <div className="grid grid-cols-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.deliveryMethod')}
                        </h3>
                        <p className="col-span-1 text-sm font-semibold">
                          {order.result.type === 'at-table'
                            ? 'Tại quán'
                            : 'Giao hàng'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2">
                        <h3 className="col-span-1 text-sm font-medium">
                          {t('order.location')}
                        </h3>
                        <p className="col-span-1 text-sm font-semibold">
                          {order.result.tableName}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Thông tin đơn hàng */}
                  <div>
                    <div className="grid w-full grid-cols-5 rounded-md bg-muted/60 px-4 py-3 text-sm font-thin">
                      <span className="col-span-2">{t('order.product')}</span>
                      <span className="col-span-1">{t('order.unitPrice')}</span>
                      <span className="col-span-1 text-center">
                        {t('order.quantity')}
                      </span>
                      <span className="col-span-1 text-center">
                        {t('order.grandTotal')}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full flex-col rounded-md border">
                    {order?.result.orderItems.map((item) => (
                      <div
                        key={item.slug}
                        className="grid w-full items-center gap-4 rounded-t-md border-b p-4 pb-4"
                      >
                        <div className="grid w-full grid-cols-5 flex-row items-center">
                          <div className="col-span-2 flex w-full gap-2">
                            <div className="flex flex-row items-center justify-center gap-2">
                              <img
                                src={`${publicFileURL}/${item.variant.product.image}`}
                                alt={item.variant.product.name}
                                className="h-16 w-24 rounded-lg object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="truncate font-bold">
                                  {item.variant.product.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1 flex">
                            <span className="text-sm">
                              {`${(item.variant.price || 0).toLocaleString('vi-VN')}đ`}
                            </span>
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <span className="text-sm">
                              {item.quantity || 0}
                            </span>
                          </div>
                          <div className="col-span-1 text-center">
                            <span className="text-sm font-semibold text-primary">
                              {`${((item.variant.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex w-full flex-col items-end justify-end gap-2 p-4">
                      <div className="flex w-[20rem] flex-col justify-start gap-2">
                        <div className="flex w-full justify-between border-b pb-4">
                          <h3 className="text-sm font-medium">
                            {t('order.total')}
                          </h3>
                          <p className="text-sm font-semibold">
                            {`${order.result.subtotal.toLocaleString('vi-VN')}đ`}
                          </p>
                        </div>
                        <div className="flex flex-col justify-start">
                          <div className="flex w-full justify-between">
                            <h3 className="text-md font-semibold">
                              {t('order.totalPayment')}
                            </h3>
                            <p className="text-lg font-semibold text-primary">
                              {`${order.result.subtotal.toLocaleString('vi-VN')}đ`}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {t('order.vat')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Lựa chọn phương thức thanh toán */}
                  <PaymentMethodSelect onSubmit={handleSelectPaymentMethod} />
                </div>
              )}
              <div className="flex justify-end">
                {paymentMethod === 'bank-transfer' && (
                  <Button
                    disabled={isDisabled}
                    className="w-fit"
                    onClick={handleConfirmPayment}
                  >
                    {t('paymentMethod.confirmPayment')}
                  </Button>
                )}
              </div>
              {qrCode && <QrCodeDialog qrCode={qrCode} />}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

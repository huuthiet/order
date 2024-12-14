import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { IOrder, IOrderType } from '@/types'
import { PaymentStatusBadge } from '@/components/app/badge/index'

interface ICustomerInfoProps {
  orderDetailData?: IOrder
}

export default function CustomerInformation({
  orderDetailData,
}: ICustomerInfoProps) {
  const { t } = useTranslation(['menu'])
  return (
    <div className="grid grid-cols-3 gap-2 pb-6 border-b-2">

      <div className='flex flex-col col-span-1 gap-2'>
        <span className="text-sm font-semibold text-muted-foreground">
          {t('order.customerInformation').toLocaleUpperCase()}
        </span>
        <div className="flex flex-col gap-1 min-h-[6rem] p-2 border rounded-md text-muted-foreground">
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
              {moment(orderDetailData?.createdAt).format('hh:mm DD/MM/YYYY')}
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
      </div>
      <div className='flex flex-col col-span-1 gap-2'>
        <span className="text-sm font-semibold text-muted-foreground">
          {t('order.deliveryMethod').toLocaleUpperCase()}
        </span>
        <div className="flex flex-col min-h-[6rem] gap-1 p-2 border rounded-md text-muted-foreground">
          <div className="grid grid-cols-3">
            <span className="col-span-2 text-xs font-semibold">
              {t('order.orderType')}
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
              {orderDetailData?.table.name}
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <span className="text-sm font-semibold text-muted-foreground">
          {t('order.paymentMethod').toLocaleUpperCase()}
        </span>
        <div className="col-span-1 flex flex-col gap-1 p-2 min-h-[6rem] border rounded-md text-muted-foreground">
          <div className="grid grid-cols-2">
            <span className="col-span-1 text-xs font-semibold">
              {t('paymentMethod.title')}
            </span>
            <span className="text-xs">
              {orderDetailData?.invoice?.paymentMethod && (
                <>
                  {orderDetailData.invoice.paymentMethod === 'bank-transfer' && (
                    <span>{t('paymentMethod.bankTransfer')}</span>
                  )}
                  {orderDetailData.invoice.paymentMethod === 'cash' && (
                    <span>{t('paymentMethod.cash')}</span>
                  )}
                </>
              )}
            </span>
          </div>
          <div className="grid grid-cols-2">
            <span className="col-span-1 text-xs font-semibold">
              {t('paymentMethod.status')}
            </span>
            <span className="col-span-1 text-xs">
              {orderDetailData?.invoice?.status && (
                <PaymentStatusBadge status={orderDetailData?.invoice.status} />
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

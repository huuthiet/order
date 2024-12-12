import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { IOrder, IOrderType } from '@/types'

interface ICustomerInfoProps {
  orderDetailData: IOrder
}

export default function CustomerInformation({
  orderDetailData,
}: ICustomerInfoProps) {
  const { t } = useTranslation(['menu'])
  return (
    <div className="grid grid-cols-2 gap-2 pb-6 border-b-2">
      <div className="flex flex-col col-span-1 gap-1 border-r-2 text-muted-foreground">
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
            {orderDetailData.createdAt ? moment(orderDetailData?.createdAt).format('hh:mm DD/MM/YYYY') : ''}
          </span>
        </div>
        {/* <div className="grid grid-cols-2">
          <span className="col-span-1 text-xs font-semibold">
            {t('order.phoneNumber')}
          </span>
          <span className="col-span-1 text-xs">
            {orderDetailData?.owner?.phonenumber}
          </span>
        </div> */}
      </div>
      <div className="col-span-1 text-muted-foreground">
        <div className="grid grid-cols-3">
          <span className="col-span-2 text-xs font-semibold">
            {t('order.deliveryMethod')}
          </span>
          <span className="col-span-1 text-xs">
            {orderDetailData?.type
              ? orderDetailData.type === IOrderType.AT_TABLE
                ? t('order.dineIn')
                : t('order.takeAway')
              : null}
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
  )
}

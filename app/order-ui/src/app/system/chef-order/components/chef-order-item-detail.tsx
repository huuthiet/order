import { useTranslation } from 'react-i18next'
import { NotepadText, PlayCircle, CheckCircle2 } from 'lucide-react'

import { ChefOrderItemStatus, ISpecificChefOrderItem, ISpecificChefOrderItems, IUpdateChefOrderItemStatusRequest } from '@/types'
import { Badge, Button } from '@/components/ui'
import { useUpdateChefOrderItemStatus } from '@/hooks'
import { showToast } from '@/utils'
import { ChefOrderItemStatusBadge } from '@/components/app/badge'

interface ChefOrderItemDetailProps {
  chefOrderItem: ISpecificChefOrderItem
}
export default function ChefOrderItemDetail({ chefOrderItem }: ChefOrderItemDetailProps) {
  const { t } = useTranslation(['chefArea'])
  const { t: tToast } = useTranslation('toast')
  const { mutate: updateChefOrderItemStatus } = useUpdateChefOrderItemStatus()

  // console.log('chefOrderItem detail', chefOrderItem.orderItem.variant.product.name)

  const handleStatusChange = (orderItem: ISpecificChefOrderItems, status: string) => {
    if (!orderItem) return
    const params: IUpdateChefOrderItemStatusRequest = {
      slug: orderItem.slug,
      status,
    }
    updateChefOrderItemStatus(params, {
      onSuccess: () => {
        showToast(tToast('toast.updateChefOrderItemStatusSuccess'))
      }
    })
  }

  const renderOrderItem = (orderItem: ISpecificChefOrderItem) => {
    const isPending = orderItem.status === ChefOrderItemStatus.PENDING
    const isInProgress = orderItem.status === ChefOrderItemStatus.IN_PROGRESS

    return (
      <div key={orderItem.slug} className="mt-4">
        <div className="flex flex-col gap-3">
          {/* Header with name and status */}
          <div className='flex justify-between items-center w-full'>
            <span className='flex gap-2 items-center'>
              <span className="text-lg font-semibold">
                {orderItem.orderItem.variant.product.name}
              </span>
              {orderItem.orderItem.variant?.size && (
                <Badge>
                  Size {orderItem.orderItem.variant.size.name.toUpperCase()}
                </Badge>
              )}
            </span>
            <ChefOrderItemStatusBadge status={orderItem.status} />
          </div>

          {/* Note section */}
          {orderItem.orderItem.note ? (
            <div className='flex gap-2 items-start p-3 rounded-md border'>
              <NotepadText className='text-primary' />
              <p className="text-sm text-muted-foreground">{orderItem.orderItem.note}</p>
            </div>
          ) : (
            <div className='flex gap-2 items-center p-3 rounded-md border'>
              <NotepadText className='text-primary' />
              <p className="text-sm text-muted-foreground">{t('chefOrder.noNote')}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end mt-2">
            {isPending && (
              <Button
                className="flex gap-2 items-center"
                onClick={() => handleStatusChange(orderItem.orderItem, ChefOrderItemStatus.IN_PROGRESS)}
              >
                <PlayCircle className="w-4 h-4" />
                {t('chefOrder.startCooking')}
              </Button>
            )}
            {isInProgress && (
              <Button
                className="flex gap-2 items-center"
                onClick={() => handleStatusChange(orderItem.orderItem, ChefOrderItemStatus.COMPLETED)}
              >
                <CheckCircle2 className="w-4 h-4" />
                {t('chefOrder.complete')}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {Array.isArray(chefOrderItem)
        ? chefOrderItem.map((item) => renderOrderItem(item))
        : chefOrderItem && renderOrderItem(chefOrderItem)}
    </div>
  )
}

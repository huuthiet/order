import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError, isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { ShoppingCart } from 'lucide-react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui'

import { IApiResponse, ICartItem, ICreateOrderRequest } from '@/types'

import { useCreateOrder } from '@/hooks'
import { showErrorToast, showToast } from '@/utils'
import { ROUTE } from '@/constants'
import { useCartItemStore, useUserStore } from '@/stores'

interface IPlaceOrderDialogProps {
  disabled?: boolean
}

export default function PlaceOrderDialog({ disabled }: IPlaceOrderDialogProps) {
  const navigate = useNavigate()
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation('common')
  const { t: tToast } = useTranslation('toast')
  const { getCartItems, clearCart } = useCartItemStore()
  const { mutate: createOrder } = useCreateOrder()
  const [isOpen, setIsOpen] = useState(false)
  const { getUserInfo } = useUserStore()

  const order = getCartItems()

  const handleSubmit = (order: ICartItem) => {
    if (!order) return // Nếu giỏ hàng trống, thoát sớm.

    const createOrderRequest: ICreateOrderRequest = {
      type: order.type,
      table: order.table || '',
      branch: order.branch || getUserInfo()?.branch?.name || '',
      owner: order.owner || '',
      orderItems: order.orderItems.map((orderItem) => ({
        quantity: orderItem.quantity,
        variant: orderItem.variant,
        note: orderItem.note || '',
      })),
    }

    // Gọi API để tạo đơn hàng.
    createOrder(createOrderRequest, {
      onSuccess: (data) => {
        navigate(`${ROUTE.STAFF_ORDER_PAYMENT}/${data.result.slug}`) // Điều hướng đến trang thành công.
        setIsOpen(false) // Đóng dialog.
        clearCart() // Xóa giỏ hàng.
        showToast(tToast('toast.createOrderSuccess')) // Thông báo thành công.
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          const axiosError = error as AxiosError<IApiResponse<void>>
          if (axiosError.response?.data.code) {
            showErrorToast(axiosError.response.data.code) // Hiển thị lỗi từ API.
          }
        }
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex justify-start w-fit" asChild>
        <DialogTrigger asChild>
          <Button
            disabled={disabled}
            className="items-center justify-center gap-1 text-sm rounded-full"
            onClick={() => setIsOpen(true)}
          >
            {/* <ShoppingCart className="icon" /> */}
            {t('order.create')}
          </Button>
        </DialogTrigger>
      </DialogTrigger>

      <DialogContent className="max-w-[22rem] rounded-md px-6 font-beVietNam sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle className="pb-4 border-b">
            <div className="flex items-center gap-2 text-primary">
              <ShoppingCart className="w-6 h-6" />
              {t('order.create')}
            </div>
          </DialogTitle>

          <div className="py-4 text-sm text-gray-500">
            {t('order.confirmOrder')}
            <br />
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {tCommon('common.cancel')}
          </Button>
          <Button onClick={() => order && handleSubmit(order)}>
            {t('order.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

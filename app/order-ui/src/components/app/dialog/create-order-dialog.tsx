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
// import { useQueryClient } from '@tanstack/react-query'

interface IPlaceOrderDialogProps {
  disabled?: boolean
}

export default function PlaceOrderDialog({ disabled }: IPlaceOrderDialogProps) {
  //   const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation(['menu'])
  const { t: tCommon } = useTranslation('common')
  const { t: tToast } = useTranslation('toast')
  const { getCartItems } = useCartItemStore()
  const { mutate: createOrder } = useCreateOrder()
  const [isOpen, setIsOpen] = useState(false)
  const { getUserInfo } = useUserStore()

  const order = getCartItems()
  console.log('check order', order)

  const handleSubmit = (order: ICartItem) => {
    if (!order) return // Nếu giỏ hàng trống, thoát sớm.

    // const firstItem = order[0] // Lấy item đầu tiên làm cơ sở cho các trường chung.

    const createOrderRequest: ICreateOrderRequest = {
      type: order.type || 'take-out', // Lấy `type` từ item đầu tiên hoặc mặc định là 'dine-in'.
      table: order.table || '', // Lấy `table` từ item đầu tiên, hoặc để trống nếu không có.
      branch: order.branch || getUserInfo()?.branch?.name || '', // Lấy `branch` từ item hoặc thông tin người dùng.
      owner: order.owner || '', // Lấy `owner` từ item đầu tiên hoặc để trống nếu không có.
      orderItems: order.orderItems.map((orderItem) => ({
        quantity: orderItem.quantity, // Lấy số lượng từ `orderItem`.
        variant: orderItem.variant, // Lấy mã `variant` từ `orderItem`.
        note: orderItem.note || '', // Ghi chú có thể để trống nếu không có.
      })),
    }

    // Gọi API để tạo đơn hàng.
    createOrder(createOrderRequest, {
      onSuccess: () => {
        navigate(ROUTE.ORDER_SUCCESS) // Điều hướng đến trang thành công.
        setIsOpen(false) // Đóng dialog.
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
      <DialogTrigger className="flex w-full justify-start" asChild>
        <DialogTrigger asChild>
          <Button
            disabled={disabled}
            className="items-center justify-center gap-1 rounded-full text-sm"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="icon" />
            {t('order.create')}
          </Button>
        </DialogTrigger>
      </DialogTrigger>

      <DialogContent className="max-w-[22rem] rounded-md font-beVietNam sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle className="border-b pb-4">
            <div className="flex items-center gap-2 text-primary">
              <ShoppingCart className="h-6 w-6" />
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
            {tCommon('common.createOrder')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

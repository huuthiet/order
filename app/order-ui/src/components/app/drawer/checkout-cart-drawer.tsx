import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useCartItemStore, useUserStore } from '@/stores'
import { Input, Label } from '@/components/ui'
import { CartNoteInput } from '@/components/app/input'
import { publicFileURL } from '@/constants'
// import { NavLink, useNavigate } from 'react-router-dom'
import { CreateOrderDialog } from '@/components/app/dialog'
import { useDebouncedInput, usePagination, useUsers } from '@/hooks'
import { IUserInfo } from '@/types'

export default function CheckoutCartDrawer() {
  const { t: tCommon } = useTranslation(['common'])
  const { t } = useTranslation('menu')
  const { pagination } = usePagination()
  const { getUserInfo } = useUserStore()
  const { inputValue, setInputValue, debouncedInputValue } = useDebouncedInput()
  const [, setSelectedUser] = useState<IUserInfo | null>(null)
  const { getCartItems, removeCartItem, addCustomerInfo } = useCartItemStore()
  const [users, setUsers] = useState<IUserInfo[]>([])

  // Fetch users with debounced phone number
  const { data: userByPhoneNumber } = useUsers(
    debouncedInputValue
      ? {
          order: 'DESC',
          page: pagination.pageIndex,
          pageSize: pagination.pageSize,
          phonenumber: debouncedInputValue,
        }
      : null, // Không gọi hook nếu không có số điện thoại
  )

  const cartItems = getCartItems()

  // Tính tổng tiền
  const subtotal = cartItems?.orderItems?.reduce((acc, orderItem) => {
    return acc + (orderItem.price || 0) * orderItem.quantity
  }, 0)

  const discount = 0 // Giả sử giảm giá là 0
  const total = subtotal ? subtotal - discount : 0

  useEffect(() => {
    if (debouncedInputValue === '') {
      // Reset danh sách user khi giá trị số điện thoại bị xóa
      setUsers([])
    } else if (userByPhoneNumber?.result?.items) {
      // Cập nhật danh sách user khi fetch thành công
      setUsers(userByPhoneNumber.result.items)
    }
  }, [debouncedInputValue, userByPhoneNumber])

  const handleRemoveCartItem = (orderItemId: string) => {
    removeCartItem(orderItemId)
  }

  const handleAddOwner = (user: IUserInfo) => () => {
    addCustomerInfo(user)
    setUsers([])
    setSelectedUser(user)
  }

  return (
    <Drawer>
      <DrawerTrigger asChild className="z-30">
        <Button
          variant="default"
          disabled={!cartItems?.table || cartItems?.table === ''}
          className="bg-primary text-white"
        >
          {t('order.confirmation')}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90%]">
        <div className="mx-4 overflow-y-auto pb-10">
          <DrawerHeader>
            <DrawerTitle>{t('order.orderInformation')}</DrawerTitle>
            <DrawerDescription>{t('menu.orderDescription')}</DrawerDescription>
          </DrawerHeader>
          <div className="">
            {/* Customer Information */}
            <div className="mt-6 flex flex-col gap-4 border-b pb-6 sm:relative">
              <div className="flex flex-col gap-4">
                <Label>{t('order.phoneNumber')}</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder={t('order.enterPhoneNumber')}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button onClick={handleAddOwner(getUserInfo() as IUserInfo)}>
                    {t('order.defaultApprover')}
                  </Button>
                </div>
                {cartItems && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {cartItems.ownerFullName}
                    </span>
                    <span className="text-sm">
                      {cartItems.ownerPhoneNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* Dropdown danh sách user */}
              {users.length > 0 && (
                <div className="absolute z-10 mt-16 w-full rounded-md border bg-white p-2 shadow-lg">
                  {users.map((user, index) => (
                    <div
                      key={user.slug}
                      onClick={handleAddOwner(user)}
                      className={`cursor-pointer p-2 hover:bg-gray-100 ${
                        index < users.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.phonenumber}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-5 flex flex-col gap-4 border-b p-4">
              <div className="flex flex-col gap-2">
                <Label>{t('order.deliveryMethod')}</Label>
                <div className="flex flex-row items-center gap-4">
                  <div className="flex w-fit items-center justify-center rounded-full bg-primary/15 px-4 py-1 text-xs font-thin text-primary">
                    {t('order.dineIn')}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {t('order.tableNumber')}: 8
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
              <div className="flex flex-col gap-4 space-y-2 py-2">
                {cartItems ? (
                  cartItems?.orderItems?.map((item) => (
                    <div
                      key={item.slug}
                      className="flex flex-col gap-4 border-b pb-4"
                    >
                      <div
                        key={`${item.slug}`}
                        className="flex flex-row items-center gap-2 rounded-xl"
                      >
                        {/* Hình ảnh sản phẩm */}
                        <img
                          src={`${publicFileURL}/${item.image}`}
                          alt={item.name}
                          className="h-20 w-20 rounded-2xl object-cover"
                        />
                        <div className="flex h-20 flex-1 flex-col gap-2 py-2">
                          <div className="flex h-full flex-row items-start justify-between">
                            <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
                              <span className="truncate font-bold">
                                {item.name}
                              </span>
                              <span className="flex items-center justify-between text-xs font-thin text-muted-foreground">
                                {`${(item.price || 0).toLocaleString('vi-VN')}đ`}
                                {/* <span className="text-muted-foreground">
                                  x1
                                </span> */}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => handleRemoveCartItem(item.id)}
                            >
                              <Trash2
                                size={20}
                                className="text-muted-foreground"
                              />
                            </Button>
                          </div>
                          <div className="flex w-full items-center justify-between text-sm font-medium">
                            <span>
                              {t('order.quantity')} {item.quantity}
                            </span>
                            <span className="font-semibold text-muted-foreground">
                              {`${((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CartNoteInput cartItem={item} />
                    </div>
                  ))
                ) : (
                  <p className="flex min-h-[12rem] items-center justify-center text-muted-foreground">
                    {tCommon('common.noData')}
                  </p>
                )}
              </div>
              {/* <PromotionInput /> */}
            </div>
          </div>
          <DrawerFooter>
            <div className="mt-auto border-t bg-background p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('order.total')}
                  </span>
                  <span>{`${subtotal?.toLocaleString('vi-VN')}đ`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('order.discount')}
                  </span>
                  <span className="text-xs text-green-600">
                    - {`${discount.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                <div className="flex flex-col justify-start border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {t('order.grandTotal')}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {`${total.toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('order.vat')}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 flex-row gap-2">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-full border border-gray-400"
                >
                  {tCommon('common.close')}
                </Button>
              </DrawerClose>
              <CreateOrderDialog disabled={!cartItems?.orderItems.length} />
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

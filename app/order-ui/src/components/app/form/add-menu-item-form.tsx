import React from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  Button,
  Input,
} from '@/components/ui'
import { addMenuItemSchema, TAddMenuItemSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { IAddMenuItemRequest } from '@/types'
import { useAddMenuItem } from '@/hooks'
import { showToast } from '@/utils'
import { menuItemStore } from '@/stores'

interface IFormAddMenuItemProps {
  addMenuItemParams: IAddMenuItemRequest
  onSubmit: (isOpen: boolean) => void
}

export const AddMenuItemForm: React.FC<IFormAddMenuItemProps> = ({
  addMenuItemParams,
  onSubmit,
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['bank'])
  const { mutate: addNewMenuItem } = useAddMenuItem()
  const { getMenuItems } = menuItemStore()
  console.log(getMenuItems())
  const form = useForm<TAddMenuItemSchema>({
    resolver: zodResolver(addMenuItemSchema),
    defaultValues: [
      {
        menuSlug: addMenuItemParams.menuSlug,
        productSlug: addMenuItemParams.productSlug,
        defaultStock: addMenuItemParams.defaultStock,
      },
    ],
  })

  const handleSubmit = (data: TAddMenuItemSchema) => {
    // Lấy danh sách productSlug từ store
    const productSlugs = getMenuItems()

    if (!productSlugs.length) {
      showToast(t('toast.noProductSelected'))
      return
    }

    // Chuẩn bị mảng các yêu cầu
    const requestData: IAddMenuItemRequest[] = productSlugs.map((slug) => ({
      menuSlug: data.menuSlug, // Sử dụng menuSlug từ form
      productSlug: slug, // Gán từng slug từ danh sách
      defaultStock: data.defaultStock, // Sử dụng defaultStock từ form
    }))

    // Gửi dữ liệu qua API
    addNewMenuItem(requestData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['menu'],
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.addMenuItemSuccess'))
      },
    })
  }

  const formFields = {
    menuSlug: (
      <FormField
        control={form.control}
        name="menuSlug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('menu.menuSlug')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    productSlug: (
      <FormField
        control={form.control}
        name="productSlug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('menu.productSlug')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    defaultStock: (
      <FormField
        control={form.control}
        name="defaultStock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('menu.defaultStock')}</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
  }

  return (
    <div className="mt-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(formFields).map((key) => (
              <React.Fragment key={key}>
                {formFields[key as keyof typeof formFields]}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-end">
            <Button className="flex justify-end" type="submit">
              {t('bank.create')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

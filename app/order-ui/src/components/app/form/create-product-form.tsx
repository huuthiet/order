import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Form,
  Button,
  Textarea,
} from '@/components/ui'
import { createProductSchema, TCreateProductSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { ICreateProductRequest } from '@/types'
import { useCreateProduct } from '@/hooks'
import { showToast } from '@/utils'
import { useQueryClient } from '@tanstack/react-query'
import { IsLimitSwitch, IsNewProductSwitch, IsTopSaleSwitch, } from '@/components/app/switch'
import { CatalogSelect } from '@/components/app/select'

interface IFormCreateProductProps {
  onSubmit: (isOpen: boolean) => void
}

export const CreateProductForm: React.FC<IFormCreateProductProps> = ({
  onSubmit,
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['product'])
  const { mutate: createProduct } = useCreateProduct()
  const defaultForm: TCreateProductSchema = {
    name: '',
    description: '',
    isLimit: false,
    isTopSell: false,
    isNew: false,
    catalog: '',
  }
  const form = useForm<TCreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: defaultForm,
  })

  const handleSubmit = (data: ICreateProductRequest, shouldCloseForm: boolean) => {
    createProduct(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['products'],
        })
        if (shouldCloseForm) {
          onSubmit(false); // Đóng form nếu cần
        }
        form.reset(defaultForm)
        showToast(t('toast.createProductSuccess'))
      },
       })
  }

  const formFields = {
    name: (
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.productName')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('product.enterProductName')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    description: (
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.productDescription')}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder={t('product.enterProductDescription')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    switch: (
      <div className='flex justify-between'>
        <FormField
          control={form.control}
          name="isLimit"
          render={({ field }) => (
            <FormItem className="flex items-center  gap-4">
              <FormControl className="flex items-center p-0">
                <IsLimitSwitch defaultValue={form.watch("isLimit")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isTopSell"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4 ">
              <FormControl className="flex items-center p-0">
                <IsTopSaleSwitch defaultValue={form.watch("isTopSell")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isNew"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl className="flex items-center p-0">
                <IsNewProductSwitch defaultValue={form.watch("isNew")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    ),
    catalog: (
      <FormField
        control={form.control}
        name="catalog"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('product.productCatalog')}</FormLabel>
            <FormControl>
              <CatalogSelect defaultValue={form.watch("catalog")} {...field} />
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
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-2">
            {Object.keys(formFields).map((key) => (
              <React.Fragment key={key}>
                {formFields[key as keyof typeof formFields]}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <Button className="flex justify-end" type="submit" onClick={form.handleSubmit((data) => handleSubmit(data, true))}>
              {t('product.btnCreate')}
            </Button>
            {/* <Button className="flex justify-end" type="submit" onClick={form.handleSubmit((data) => handleSubmit(data, false))}>
              {t('product.btnCreateAndContinue')}
            </Button> */}
          </div>
        </form>
      </Form>
    </div>
  )
}

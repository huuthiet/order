import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
  ScrollArea,
} from '@/components/ui'
import { createTableSchema, TCreateTableSchema } from '@/schemas'

import { zodResolver } from '@hookform/resolvers/zod'
import { ICreateTableRequest } from '@/types'
import { useCreateTable } from '@/hooks'
import { showToast } from '@/utils'
import { BranchSelect } from '@/components/app/select'
import { TableStatus } from '@/constants'
// import { IsEmptySwitch } from '../switch'

interface IFormCreateTableProps {
  onSubmit: (isOpen: boolean) => void
}

export const CreateTableForm: React.FC<IFormCreateTableProps> = ({
  onSubmit,
}) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['table'])
  const { mutate: createTable } = useCreateTable()
  const form = useForm<TCreateTableSchema>({
    resolver: zodResolver(createTableSchema),
    defaultValues: {
      name: '',
      branch: '',
      location: '',
      status: TableStatus.AVAILABLE,
      // isEmpty: false,
      xPosition: 0,
      yPosition: 0,
    },
  })

  const handleSubmit = (data: ICreateTableRequest) => {
    createTable(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['tables'],
        })
        onSubmit(false)
        form.reset()
        showToast(t('toast.createTableSuccess'))
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
            <FormLabel>{t('table.tableName')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('table.enterTableName')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    branch: (
      <FormField
        control={form.control}
        name="branch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('table.branch')}</FormLabel>
            <FormControl>
              <BranchSelect {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    location: (
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('table.location')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('table.enterLocation')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    status: (
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('table.status')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('table.enterStatus')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    // isEmpty: (
    //   <FormField
    //     control={form.control}
    //     name="isEmpty"
    //     render={({ field }) => (
    //       <FormItem>
    //         <FormControl>
    //           <IsEmptySwitch defaultValue={false} {...field} />
    //         </FormControl>
    //         <FormMessage />
    //       </FormItem>
    //     )}
    //   />
    // ),
    xPosition: (
      <FormField
        control={form.control}
        name="xPosition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('table.xPosition')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('table.enterXPosition')} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ),
    yPosition: (
      <FormField
        control={form.control}
        name="yPosition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('table.yPosition')}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t('table.enterYPosition')} />
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
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-1 gap-2">
              {Object.keys(formFields).map((key) => (
                <React.Fragment key={key}>
                  {formFields[key as keyof typeof formFields]}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end">
            <Button className="flex justify-end" type="submit">
              {t('table.create')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

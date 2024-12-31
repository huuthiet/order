import moment from 'moment'
import { Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ISpecificMenu } from '@/types'

interface ICurrentDateInputProps {
  menu: ISpecificMenu | undefined
}

export default function DateInput({ menu }: ICurrentDateInputProps) {
  const { t } = useTranslation('common')

  const currentDate = moment(new Date()).format('DD/MM/YYYY')
  const dayOfWeek =
    menu?.dayIndex !== undefined ? t(`dayOfWeek.${menu?.dayIndex}`) : ''

  return (
    <div className="flex w-full items-end justify-center gap-1 rounded-sm bg-gray-100 py-2 text-[14px] text-gray-500">
      <Calendar className="" />
      <span>
        {dayOfWeek} {currentDate}
      </span>
    </div>
  )
}

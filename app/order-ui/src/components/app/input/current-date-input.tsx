import moment from 'moment'
import { Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui'
import { ISpecificMenu } from '@/types'

interface ICurrentDateInputProps {
  menu: ISpecificMenu | undefined
}

export default function DateInput({ menu }: ICurrentDateInputProps) {
  const { t } = useTranslation('common')

  const currentDate = moment(new Date()).format('DD/MM/YYYY')
  const dayOfWeek = t(`dayOfWeek.${menu?.dayIndex}`)

  return (
    <div className="relative grid items-center grid-cols-1">
      {/* Icon Calendar */}
      <Calendar className="absolute w-5 h-5 text-gray-500 pointer-events-none left-2" />

      {/* Input */}
      <Input
        type="text"
        id="date-input"
        readOnly
        value={`${dayOfWeek}, ${currentDate}`}
        className="pr-2 cursor-not-allowed text-muted-foreground pl-9 h-9"
      />
    </div>
  )
}

import React, { useState } from 'react'
import moment from 'moment'
import { Calendar } from 'lucide-react'

import { Input } from '@/components/ui'

export default function DateInput() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return moment().format('DD/MM/YYYY')
  })

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = moment(event.target.value, 'YYYY-MM-DD')
    setSelectedDate(rawDate.format('DD/MM/YYYY'))
  }

  return (
    <div className="relative flex items-center">
      {/* Icon Calendar */}
      <Calendar className="absolute w-5 h-5 text-gray-500 pointer-events-none left-2" />

      {/* Input */}
      <Input
        type="date"
        id="date-input"
        readOnly
        value={moment(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD')} // Định dạng lại để phù hợp với <input type="date">
        onChange={handleDateChange}
        className="w-full pr-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed pl-9 h-9"
      />
    </div>
  )
}

import { useState } from 'react'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import {
  DataTableFilterOptionsProps,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { LoggerLevel } from '@/constants'
import { ILogger, TLoggerLevel } from '@/types'

export default function DataTableFilterOptions({
  setFilterOption,
}: DataTableFilterOptionsProps<ILogger>) {
  const { t } = useTranslation('common')
  const [filterValue, setFilterValue] = useState<string>('all')

  const handleFilterChange = (value: string) => {
    setFilterValue(value)

    let filterConditions: ColumnFiltersState = []

    const applyFilter = (level: TLoggerLevel) => {
      filterConditions = [
        {
          id: 'level',
          value: level,
        },
      ]
    }

    switch (value) {
      // Approval Stage 1
      case LoggerLevel.INFO:
        applyFilter(LoggerLevel.INFO)
        break
      case LoggerLevel.WARN:
        applyFilter(LoggerLevel.WARN)
        break
      case LoggerLevel.ERROR:
        applyFilter(LoggerLevel.ERROR)
        break
      case LoggerLevel.DEBUG:
        applyFilter(LoggerLevel.DEBUG)
        break
      default:
        filterConditions = []
    }

    setFilterOption(filterConditions)
  }

  return (
    <Select value={filterValue} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-[12rem]">
        <SelectValue placeholder={t('dataTable.filter')} />
      </SelectTrigger>
      <SelectContent side="top">
        <SelectItem value="all">{t('dataTable.all')}</SelectItem>
        <>
          <SelectItem value="info">{t('dataTable.info')}</SelectItem>
          <SelectItem value="warn">{t('dataTable.warn')}</SelectItem>
          <SelectItem value="error">{t('dataTable.error')}</SelectItem>
        </>
      </SelectContent>
    </Select>
  )
}

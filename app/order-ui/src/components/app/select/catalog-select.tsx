import { useEffect, useState } from 'react'
import ReactSelect, { SingleValue } from 'react-select'

import { useCatalogs } from '@/hooks'

interface SelectCatalogProps {
  defaultValue?: string
  onChange: (value: string) => void
}

export default function CatalogSelect({
  defaultValue,
  onChange,
}: SelectCatalogProps) {
  const [allCatalogs, setAllCatalogs] = useState<
    { value: string; label: string }[]
  >([])
  const [selectedCatalog, setSelectedCatalog] = useState<{
    value: string
    label: string
  } | null>(null)
  //   const { pagination, handlePageChange } = usePagination({ isSearchParams: false })
  const { data } = useCatalogs()

  //   const handleScrollToBottom = () => {
  //     if (data?.result?.page && data.result.totalPages) {
  //       if (data.result.page < data.result.totalPages) handlePageChange(pagination.pageIndex + 1)
  //     }
  //   }

  // Effect to append new users to the local state when users are fetched
  useEffect(() => {
    if (data?.result) {
      const newCatalogs = data.result.map((item) => ({
        value: item.slug || '',
        label: item.name || '',
      }))
      // Append new users to the previous users
      setAllCatalogs(newCatalogs)
    }
  }, [data])

  // Set default value when it's available
  useEffect(() => {
    if (defaultValue && allCatalogs.length > 0) {
      const defaultOption = allCatalogs.find(
        (catalog) => catalog.value === defaultValue,
      )
      if (defaultOption) {
        setSelectedCatalog(defaultOption)
      }
    }
  }, [defaultValue, allCatalogs])

  const handleChange = (
    selectedOption: SingleValue<{ value: string; label: string }>,
  ) => {
    if (selectedOption) {
      setSelectedCatalog(selectedOption)
      onChange(selectedOption.value) // Only pass the value (slug)
    }
  }

  return (
    <ReactSelect
      value={selectedCatalog}
      onMenuScrollToBottom={() => {}}
      options={allCatalogs}
      onChange={handleChange}
      defaultValue={selectedCatalog}
    />
  )
}

import { useEffect, useState } from 'react'
import ReactSelect, { SingleValue } from 'react-select'

import { useAllTableLocations } from '@/hooks'

interface SelectTableLocationProps {
    defaultValue?: string
    onChange: (value: string) => void
}

export default function TableLocationSelect({
    defaultValue,
    onChange,
}: SelectTableLocationProps) {
    const [allTableLocations, setAllTableLocations] = useState<
        { value: string; label: string }[]
    >([])
    const [selectedTableLocation, setSelectedTableLocation] = useState<{
        value: string
        label: string
    } | null>(null)
    //   const { pagination, handlePageChange } = usePagination({ isSearchParams: false })
    const { data } = useAllTableLocations()

    //   const handleScrollToBottom = () => {
    //     if (data?.result?.page && data.result.totalPages) {
    //       if (data.result.page < data.result.totalPages) handlePageChange(pagination.pageIndex + 1)
    //     }
    //   }

    // Effect to append new users to the local state when users are fetched
    useEffect(() => {
        if (data?.result) {
            const newTableLocations = data.result.map((item) => ({
                value: item.id || '',
                label: item.name || '',
            }))
            // Append new users to the previous users
            setAllTableLocations((prevTableLocations) => [...prevTableLocations, ...newTableLocations])
        }
    }, [data])

    // Set default value when it's available
    useEffect(() => {
        if (defaultValue && allTableLocations.length > 0) {
            const defaultOption = allTableLocations.find(
                (tableLocation) => tableLocation.value === defaultValue,
            )
            if (defaultOption) {
                setSelectedTableLocation(defaultOption)
            }
        }
    }, [defaultValue, allTableLocations])

    const handleChange = (
        selectedOption: SingleValue<{ value: string; label: string }>,
    ) => {
        if (selectedOption) {
            setSelectedTableLocation(selectedOption)
            onChange(selectedOption.value) // Only pass the value (slug)
        }
    }

    return (
        <ReactSelect
            value={selectedTableLocation}
            onMenuScrollToBottom={() => { }}
            options={allTableLocations}
            onChange={handleChange}
            defaultValue={selectedTableLocation || allTableLocations.find(option => option.value === defaultValue)}
        />
    )
}

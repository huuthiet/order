import { useEffect, useState } from 'react'
import ReactSelect, { SingleValue } from 'react-select'

import { useRole } from '@/hooks'

interface SelectRoleProps {
    defaultValue?: string
    onChange: (value: string) => void
}

export default function RoleSelect({
    defaultValue,
    onChange,
}: SelectRoleProps) {
    const [allRoles, setAllRoles] = useState<{ value: string; label: string }[]>(
        [],
    )
    const [selectedRole, setSelectedRole] = useState<{
        value: string
        label: string
    } | null>(null)
    //   const { pagination, handlePageChange } = usePagination({ isSearchParams: false })
    const { data } = useRole()

    //   const handleScrollToBottom = () => {
    //     if (data?.result?.page && data.result.totalPages) {
    //       if (data.result.page < data.result.totalPages) handlePageChange(pagination.pageIndex + 1)
    //     }
    //   }

    // Effect to append new users to the local state when users are fetched
    useEffect(() => {
        if (data?.result) {
            const newRoles = data.result.map((item) => ({
                value: item.slug || '',
                label: item.name || '',
            }))
            // Append new users to the previous users
            setAllRoles(newRoles)
        }
    }, [data])

    // Set default value when it's available
    useEffect(() => {
        if (defaultValue && allRoles.length > 0) {
            const defaultOption = allRoles.find((role) => role.value === defaultValue)
            if (defaultOption) {
                setSelectedRole(defaultOption)
            }
        }
    }, [defaultValue, allRoles])

    const handleChange = (
        selectedOption: SingleValue<{ value: string; label: string }>,
    ) => {
        if (selectedOption) {
            setSelectedRole(selectedOption)
            onChange(selectedOption.value) // Only pass the value (slug)
        }
    }

    return (
        <ReactSelect
            value={selectedRole}
            onMenuScrollToBottom={() => { }}
            options={allRoles}
            onChange={handleChange}
            defaultValue={selectedRole}
        />
    )
}

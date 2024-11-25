import { useEffect, useState } from 'react'
import ReactSelect, { SingleValue } from 'react-select'

import { useBranch } from '@/hooks'

interface SelectBranchProps {
  defaultValue?: string
  onChange: (value: string) => void
}

export default function BranchSelect({
  defaultValue,
  onChange,
}: SelectBranchProps) {
  const [allBranches, setAllBranches] = useState<
    { value: string; label: string }[]
  >([])
  const [selectedBranch, setSelectedBranch] = useState<{
    value: string
    label: string
  } | null>(null)
  const { data } = useBranch()

  useEffect(() => {
    if (data?.result) {
      const newBranches = data.result.map((item) => ({
        value: item.slug || '',
        label: `${item.name} - ${item.address}`,
      }))
      setAllBranches(newBranches)

      // Set default value khi branches được load
      if (defaultValue) {
        const defaultOption = newBranches.find(
          (branch) => branch.value === defaultValue,
        )
        if (defaultOption) {
          setSelectedBranch(defaultOption)
        }
      }
    }
  }, [data, defaultValue])

  const handleChange = (
    selectedOption: SingleValue<{ value: string; label: string }>,
  ) => {
    if (selectedOption) {
      setSelectedBranch(selectedOption)
      onChange(selectedOption.value)
    }
  }

  return (
    <ReactSelect
      value={selectedBranch} // Hiển thị giá trị mặc định đã chọn
      options={allBranches} // Danh sách options
      onChange={handleChange}
    />
  )
}

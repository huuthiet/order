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
        label: `${item.name} - ${item.address}`, // Kết hợp name và address
      }))
      setAllBranches((prevBranches) => [...prevBranches, ...newBranches])
    }
  }, [data])

  useEffect(() => {
    if (defaultValue && allBranches.length > 0) {
      const defaultOption = allBranches.find(
        (branch) => branch.value === defaultValue,
      )
      if (defaultOption) {
        setSelectedBranch(defaultOption)
      }
    }
  }, [defaultValue, allBranches])

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
      value={selectedBranch}
      options={allBranches}
      onChange={handleChange}
      defaultValue={selectedBranch}
    />
  )
}

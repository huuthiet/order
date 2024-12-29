import { useEffect, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";

import { useBranch } from "@/hooks";

interface SelectBranchProps {
  defaultValue?: string;
  onChange: (value: string) => void;
}

export default function BranchSelect({
  defaultValue,
  onChange,
}: SelectBranchProps) {
  const [allBranches, setAllBranches] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedBranch, setSelectedBranch] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const { data } = useBranch();

  useEffect(() => {
    if (data?.result) {
      const newBranches = data.result.map((item) => ({
        value: item.slug || "",
        label: `${item.name} - ${item.address}`,
      }));
      setAllBranches(newBranches);

      // Set giá trị mặc định
      const defaultOption =
        defaultValue !== undefined
          ? newBranches.find((branch) => branch.value === defaultValue) // Nếu có defaultValue
          : newBranches[0]; // Nếu không có, chọn giá trị đầu tiên
      if (defaultOption) {
        setSelectedBranch(defaultOption);
        onChange(defaultOption.value); // Gọi onChange với giá trị mặc định
      }
    }
  }, [data, defaultValue, onChange]);

  const handleChange = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    if (selectedOption) {
      setSelectedBranch(selectedOption);
      onChange(selectedOption.value);
    }
  };

  return (
    <ReactSelect
      className="rounded-lg w-fit border-muted-foreground" // Độ rộng của component
      value={selectedBranch} // Hiển thị giá trị mặc định đã chọn
      options={allBranches} // Danh sách options
      onChange={handleChange}
    />
  );
}

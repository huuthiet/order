import { Handle, Position } from '@xyflow/react'

interface TableNodeProps {
  data: {
    label: string
  }
}

export default function TableNode({ data }: TableNodeProps) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-white shadow-md">
      <Handle type="target" position={Position.Top} />
      <div className="text-center">
        <span className="font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

import { ITable } from '@/types'
import { TableStatus } from '@/constants'
import { cn } from '@/lib'

interface TableItemProps {
  table: ITable
  isSelected?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export default function NonResizableTableItem({
  table,
  isSelected,
  onClick,
}: TableItemProps) {
  const getStatusColor = () => {
    switch (table.status) {
      case TableStatus.AVAILABLE:
        return 'bg-muted-foreground/10'
      case TableStatus.RESERVED:
        return 'bg-yellow-500'
      default:
        return 'border-gray-500'
    }
  }

  return (
    <div className={cn('mt-4')} onClick={onClick}>
      <div
        className={`rounded-md bg-transparent p-2 transition-all duration-200 ${
          isSelected
            ? 'z-10 scale-110 border-primary bg-primary/10 ring-2 ring-green-500'
            : 'bg-background hover:scale-105 hover:ring-2 hover:ring-primary/50'
        } `}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {/* <div className={`w-2 h-3/5 rounded-full ${getStatusColor()}`} /> */}
            <div className="flex flex-col items-center gap-2">
              <div className={`h-2 w-2/3 rounded-full ${getStatusColor()}`} />
              <div
                className={`flex min-h-[2rem] min-w-[3rem] cursor-pointer items-center justify-center rounded-md sm:min-h-[4rem] sm:min-w-[6rem] ${getStatusColor()}`}
              >
                {/* <span className="flex items-center justify-center p-1 text-sm font-medium bg-white rounded-full h-7 w-7 text-muted-foreground">
                  {table.name}
                </span> */}
              </div>

              <div className={`h-2 w-2/3 rounded-full ${getStatusColor()}`} />
            </div>
            {/* <div className={`w-2 h-3/5 rounded-full ${getStatusColor()}`} /> */}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {table.name}
          </span>
        </div>
      </div>
    </div>
  )
}

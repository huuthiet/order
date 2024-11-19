import { LoggerLevel } from '@/types'

interface ILogLevelBadgeProps {
  level: LoggerLevel
}

const getBadgeColor = (level: LoggerLevel) => {
  switch (level) {
    case 'error':
      return 'bg-destructive/20 border-destructive border text-destructive'
    case 'warn':
      return 'bg-yellow-500/20 border-yellow-500 border text-yellow-500'
    case 'info':
      return 'bg-blue-500/20 border-blue-500 border text-blue-500'
    case 'debug':
      return 'bg-gray-500/20 border-gray-500 border text-gray-500'
    default:
      return 'bg-gray-500/20 border-gray-500 border text-gray-500'
  }
}

const getBadgeText = (level: LoggerLevel) => {
  switch (level) {
    case 'error':
      return 'Error'
    case 'warn':
      return 'Warn'
    case 'info':
      return 'Info'
    case 'debug':
      return 'Debug'
    default:
      return 'Debug'
  }
}

export default function LogLevelBadge({ level }: ILogLevelBadgeProps) {
  // Ensure the component returns valid JSX
  return (
    <span
      className={`inline-block py-1 px-1.5 min-w-[4.5rem] text-xs font-beVietNam text-center ${getBadgeColor(
        level
      )} rounded-full`}
    >
      {getBadgeText(level)}
    </span>
  )
}

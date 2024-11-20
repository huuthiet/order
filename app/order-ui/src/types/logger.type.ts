export interface ILogger {
  level: LoggerLevel
  message: string
  context: string
  timestamp: string
  pid: number
  slug: string
}

export type LoggerLevel = 'error' | 'warn' | 'info' | 'debug'

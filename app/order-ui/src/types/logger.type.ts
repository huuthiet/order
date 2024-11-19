export interface ILogger {
  level: string
  message: string
  context: string
  timestamp: string
  pid: number
  slug: string
}

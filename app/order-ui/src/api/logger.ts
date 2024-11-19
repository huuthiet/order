import { IApiResponse, ILogger } from '@/types'
import { http } from '@/utils'

export async function logger(logLevel?: string): Promise<IApiResponse<ILogger[]>> {
  const response = await http.get<IApiResponse<ILogger[]>>(
    '/logger',
    logLevel ? { params: { logLevel } } : undefined
  )
  return response.data
}

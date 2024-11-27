import { IApiResponse, ILogger, IPaginationResponse, IQuery } from '@/types'
import { http } from '@/utils'

export async function logger(
  params: IQuery,
): Promise<IApiResponse<IPaginationResponse<ILogger>>> {
  const response = await http.get<IApiResponse<IPaginationResponse<ILogger>>>(
    '/logger',
    { params },
    // logLevel ? { params: { logLevel } } : undefined,
  )
  return response.data
}

import { IApiResponse, ILogger, IPaginationResponse, IQuery } from '@/types'
import { http } from '@/utils'

export async function logger(
  params: IQuery,
): Promise<IApiResponse<IPaginationResponse<ILogger>>> {
  const response = await http.get<IApiResponse<IPaginationResponse<ILogger>>>(
    '/logger',
    {
      // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
      doNotShowLoading: true,
      params,
    },
    // logLevel ? { params: { logLevel } } : undefined,
  )
  // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
  return response.data
}

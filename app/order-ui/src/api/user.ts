import { http } from '@/utils'
import { IApiResponse, IUserInfo, IPaginationResponse, IQuery } from '@/types'

export async function getUsers(
  params: IQuery,
): Promise<IApiResponse<IPaginationResponse<IUserInfo>>> {
  const response = await http.get<IApiResponse<IPaginationResponse<IUserInfo>>>(
    '/user',
    {
      params,
    },
  )
  return response.data
}

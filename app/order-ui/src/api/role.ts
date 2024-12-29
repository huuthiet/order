import { http } from '@/utils'
import { IApiResponse, IRole } from '@/types'

export async function getRole(): Promise<IApiResponse<IRole[]>> {
  const response = await http.get<IApiResponse<IRole[]>>('/role')
  return response.data
}

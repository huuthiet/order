import { IApiResponse, IProfileResponse } from '@/types'
import { http } from '@/utils'

export async function getProfile(): Promise<IApiResponse<IProfileResponse>> {
  const response = await http.get<IApiResponse<IProfileResponse>>('/profile')
  return response.data
}

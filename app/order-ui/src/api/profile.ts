import { IApiResponse, IUserInfo, IUpdateProfileRequest } from '@/types'
import { http } from '@/utils'

export async function getProfile(): Promise<IApiResponse<IUserInfo>> {
  const response = await http.get<IApiResponse<IUserInfo>>('/auth/profile')
  return response.data
}

export async function updateProfile(
  data: IUpdateProfileRequest,
): Promise<IApiResponse<IUpdateProfileRequest>> {
  const response = await http.patch<IApiResponse<IUpdateProfileRequest>>(
    '/auth/profile',
    data,
  )
  return response.data
}

import {
  IApiResponse,
  IUserInfo,
  IUpdateProfileRequest,
  IUpdatePasswordRequest,
} from '@/types'
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

export async function updatePassword(
  data: IUpdatePasswordRequest,
): Promise<IApiResponse<IUserInfo>> {
  const response = await http.post<IApiResponse<IUserInfo>>(
    '/auth/change-password',
    data,
  )
  return response.data
}

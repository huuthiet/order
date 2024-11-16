import { IApiResponse, ILoginResponse } from '@/types'
import { http } from '@/utils'

export async function login(params: {
  phonenumber: string
  password: string
}): Promise<IApiResponse<ILoginResponse>> {
  const response = await http.post<IApiResponse<ILoginResponse>>('/auth/login', params)
  return response.data
}

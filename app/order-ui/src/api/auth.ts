import { IApiResponse, ILoginResponse } from '@/types'
import { http } from '@/utils'

export async function login(params: {
  phonenumber: string
  password: string
}): Promise<ILoginResponse> {
  const response = await http.post<ILoginResponse>('/auth/login', params)
  return response.data
}

export async function register(params: {
  phonenumber: string
  password: string
  firstName: string
  lastName: string
}): Promise<IApiResponse<ILoginResponse>> {
  const response = await http.post<IApiResponse<ILoginResponse>>('/auth/register', params)
  return response.data
}

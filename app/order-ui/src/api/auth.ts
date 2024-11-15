import { IApiResponse, ILoginRequest, ILoginResponse } from '@/types'
import { http } from '@/utils'

export async function login(params: ILoginRequest): Promise<IApiResponse<ILoginResponse>> {
  const response = await http.post<IApiResponse<ILoginResponse>>('/auth/login', { data: params })
  return response.data
}

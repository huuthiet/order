import { ILoginRequest, ILoginResponse } from '@/types'
import { http } from '@/utils'

export async function login(params: ILoginRequest): Promise<ILoginResponse> {
  return http.post('/auth/login', { data: params })
}

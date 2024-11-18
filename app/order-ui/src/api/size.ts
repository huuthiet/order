import { http } from '@/utils'
import { IApiResponse, ISizeResponse } from '@/types'

export async function getSize(): Promise<IApiResponse<ISizeResponse>> {
  const response = await http.get<IApiResponse<ISizeResponse>>('/sizes')
  return response.data
}

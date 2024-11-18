import { http } from '@/utils'
import { IApiResponse, ICreateSizeRequest, ISizeResponse, IUpdateSizeRequest } from '@/types'

export async function getSize(): Promise<IApiResponse<ISizeResponse>> {
  const response = await http.get<IApiResponse<ISizeResponse>>('/sizes')
  return response.data
}

export async function createSize(params: ICreateSizeRequest): Promise<IApiResponse<ISizeResponse>> {
  const response = await http.post<IApiResponse<ISizeResponse>>('/sizes', params)
  return response.data
}

export async function updateSize(params: IUpdateSizeRequest): Promise<IApiResponse<ISizeResponse>> {
  const response = await http.patch<IApiResponse<ISizeResponse>>(`/sizes/${params.slug}`, params)
  return response.data
}

export async function deleteSize(slug: string): Promise<IApiResponse<ISizeResponse>> {
  const response = await http.delete<IApiResponse<ISizeResponse>>(`/sizes/${slug}`)
  return response.data
}

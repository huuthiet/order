import { http } from '@/utils'
import { IApiResponse, ICreateSizeRequest, ISize, IUpdateSizeRequest } from '@/types'

export async function getSize(): Promise<IApiResponse<ISize[]>> {
  const response = await http.get<IApiResponse<ISize[]>>('/sizes')
  return response.data
}

export async function createSize(params: ICreateSizeRequest): Promise<IApiResponse<ISize>> {
  const response = await http.post<IApiResponse<ISize>>('/sizes', params)
  return response.data
}

export async function updateSize(params: IUpdateSizeRequest): Promise<IApiResponse<ISize>> {
  const response = await http.patch<IApiResponse<ISize>>(`/sizes/${params.slug}`, params)
  return response.data
}

export async function deleteSize(slug: string): Promise<IApiResponse<ISize>> {
  const response = await http.delete<IApiResponse<ISize>>(`/sizes/${slug}`)
  return response.data
}

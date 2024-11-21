import { http } from '@/utils'
import { IApiResponse, ICreateProductRequest, IProduct, IUpdateProductRequest } from '@/types'

export async function getAllProducts(): Promise<IApiResponse<IProduct[]>> {
  const response = await http.get<IApiResponse<IProduct[]>>('/products')
  return response.data
}

export async function createProduct(data: ICreateProductRequest): Promise<IApiResponse<IProduct>> {
  const response = await http.post<IApiResponse<IProduct>>('/products', data)
  return response.data
}

export async function updateProduct(data: IUpdateProductRequest): Promise<IApiResponse<IProduct>> {
  const response = await http.patch<IApiResponse<IProduct>>(`/products/${data.slug}`, data)
  return response.data
}

export async function deleteProduct(slug: string): Promise<IApiResponse<IProduct>> {
  const response = await http.delete<IApiResponse<IProduct>>(`/products/${slug}`)
  return response.data
}

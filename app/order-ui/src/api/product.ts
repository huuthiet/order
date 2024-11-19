import { http } from '@/utils'
import { IApiResponse, IProduct } from '@/types'

export async function getAllProducts(): Promise<IApiResponse<IProduct[]>> {
  const response = await http.get<IApiResponse<IProduct[]>>('/products')
  return response.data
}

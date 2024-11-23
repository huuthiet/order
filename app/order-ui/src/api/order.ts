import { http } from '@/utils'
import { IApiResponse, IOrder, ICreateOrderRequest } from '@/types'

export async function getAllOrders(): Promise<IApiResponse<IOrder[]>> {
  const response = await http.get<IApiResponse<IOrder[]>>('/orders')
  return response.data
}

export async function createOrder(
  params: ICreateOrderRequest,
): Promise<IApiResponse<ICreateOrderRequest>> {
  const response = await http.post<IApiResponse<ICreateOrderRequest>>(
    '/orders',
    params,
  )
  return response.data
}

export async function getOrderBySlug(
  slug: string,
): Promise<IApiResponse<IOrder>> {
  const response = await http.get<IApiResponse<IOrder>>(`/orders/${slug}`)
  return response.data
}

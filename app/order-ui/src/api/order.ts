import { http } from '@/utils'
import {
  IApiResponse,
  IOrder,
  ICreateOrderRequest,
  IInitateQrCodeRequest,
  ICreateOrderResponse,
  IInitiateQrCodeResponse,
} from '@/types'

export async function getAllOrders(): Promise<IApiResponse<IOrder[]>> {
  const response = await http.get<IApiResponse<IOrder[]>>('/orders')
  return response.data
}

export async function createOrder(
  params: ICreateOrderRequest,
): Promise<IApiResponse<ICreateOrderResponse>> {
  const response = await http.post<IApiResponse<ICreateOrderResponse>>(
    '/orders',
    params,
  )
  return response.data
}

export async function getOrderBySlug(
  slug: string,
): Promise<IApiResponse<ICreateOrderResponse>> {
  const response = await http.get<IApiResponse<ICreateOrderResponse>>(
    `/orders/${slug}`,
  )
  return response.data
}

export async function initializeQrCode(
  params: IInitateQrCodeRequest,
): Promise<IApiResponse<IInitiateQrCodeResponse>> {
  const response = await http.post<IApiResponse<IInitiateQrCodeResponse>>(
    `/payment/initiate`,
    params,
  )
  return response.data
}

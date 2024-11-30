import { http } from '@/utils'
import {
  IApiResponse,
  IOrder,
  ICreateOrderRequest,
  IInitiateQrCodeRequest,
  ICreateOrderResponse,
  IInitiateQrCodeResponse,
  ICreateOrderTrackingRequest,
  IOrderTracking,
} from '@/types'

export async function getAllOrders(params: {
  ownerSlug?: string
  branchSlug?: string
}): Promise<IApiResponse<IOrder[]>> {
  const response = await http.get<IApiResponse<IOrder[]>>('/orders', {
    params,
  })
  return response.data
}

export async function getOrderBySlug(
  slug: string,
): Promise<IApiResponse<IOrder>> {
  const response = await http.get<IApiResponse<IOrder>>(`/orders/${slug}`)
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

export async function initializeQrCode(
  params: IInitiateQrCodeRequest,
): Promise<IApiResponse<IInitiateQrCodeResponse>> {
  const response = await http.post<IApiResponse<IInitiateQrCodeResponse>>(
    `/payment/initiate`,
    params,
  )
  return response.data
}

export async function createOrderTracking(
  params: ICreateOrderTrackingRequest,
): Promise<IApiResponse<IOrderTracking>> {
  const response = await http.post<IApiResponse<IOrderTracking>>(
    `/trackings`,
    params,
  )
  return response.data
}

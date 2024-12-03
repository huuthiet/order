import { saveAs } from 'file-saver'

import { http } from '@/utils'
import {
  IApiResponse,
  IOrder,
  ICreateOrderRequest,
  IInitiatePaymentRequest,
  ICreateOrderResponse,
  IInitiatePaymentResponse,
  ICreateOrderTrackingRequest,
  IOrderTracking,
  IOrderInvoice,
  IGetOrderInvoiceRequest,
  IPaginationResponse,
  IOrdersQuery,
} from '@/types'
import { useDownloadStore } from '@/stores'
import { AxiosRequestConfig } from 'axios'

export async function getAllOrders(
  params: IOrdersQuery,
): Promise<IApiResponse<IPaginationResponse<IOrder>>> {
  const response = await http.get<IApiResponse<IPaginationResponse<IOrder>>>(
    '/orders',

    {
      // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
      doNotShowLoading: true,
      params,
    },
  )
  // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
  return response.data
}

export async function getOrderBySlug(
  slug: string,
): Promise<IApiResponse<IOrder>> {
  const response = await http.get<IApiResponse<IOrder>>(`/orders/${slug}`, {
    // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
    doNotShowLoading: true,
  })
  // @ts-expect-error doNotShowLoading is not in AxiosRequestConfig
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

export async function initiatePayment(
  params: IInitiatePaymentRequest,
): Promise<IApiResponse<IInitiatePaymentResponse>> {
  const response = await http.post<IApiResponse<IInitiatePaymentResponse>>(
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

export async function getOrderInvoice(
  params: IGetOrderInvoiceRequest,
): Promise<IApiResponse<IPaginationResponse<IOrderInvoice>>> {
  const response = await http.get<
    IApiResponse<IPaginationResponse<IOrderInvoice>>
  >('/invoice/specific', {
    params,
  })
  return response.data
}

export async function createOrderInvoice(
  orderSlug: string,
): Promise<IApiResponse<IOrderInvoice>> {
  const response = await http.post<IApiResponse<IOrderInvoice>>(`/invoice`, {
    orderSlug,
  })
  return response.data
}

export async function exportOrderInvoice(
  slug: string,
): Promise<IApiResponse<string>> {
  const { setProgress, setFileName, setIsDownloading, reset } =
    useDownloadStore.getState()
  setFileName(`${slug}.pdf`)
  setIsDownloading(true)

  try {
    const response = await http.get(`/invoice${slug}/export`, {
      responseType: 'blob',
      headers: {
        Accept: 'application/pdf',
      },
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
        )
        setProgress(percentCompleted)
      },
      doNotShowLoading: true,
    } as AxiosRequestConfig)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    saveAs(blob, `${slug}.pdf`)
    return response.data
  } finally {
    setIsDownloading(false)
    reset()
  }
}

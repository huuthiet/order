import { http } from '@/utils'
import {
  IApiResponse,
  ICreateTableRequest,
  ITable,
  IUpdateTableRequest,
} from '@/types'

export async function getAllTables(): Promise<IApiResponse<ITable[]>> {
  const response = await http.get<IApiResponse<ITable[]>>('/tables')
  return response.data
}

export async function createTable(
  data: ICreateTableRequest,
): Promise<IApiResponse<ICreateTableRequest>> {
  const response = await http.post<IApiResponse<ICreateTableRequest>>(
    '/tables',
    data,
  )
  return response.data
}

export async function updateTable(
  data: IUpdateTableRequest,
): Promise<IApiResponse<IUpdateTableRequest>> {
  const response = await http.put<IApiResponse<IUpdateTableRequest>>(
    `/tables/${data.slug}`,
    data,
  )
  return response.data
}

export async function deleteTable(slug: string): Promise<IApiResponse<null>> {
  const response = await http.delete<IApiResponse<null>>(`/tables/${slug}`)
  return response.data
}

import { http } from '@/utils'
import {
  IApiResponse,
  ICreateMenuRequest,
  IMenu,
  ISpecificMenu,
  ISpecificMenuRequest,
  IUpdateMenuRequest,
} from '@/types'

export async function getAllMenus(): Promise<IApiResponse<IMenu[]>> {
  const response = await http.get<IApiResponse<IMenu[]>>('/menu')
  return response.data
}

export async function getSpecificMenu(
  query: ISpecificMenuRequest,
): Promise<IApiResponse<ISpecificMenu>> {
  const response = await http.get<IApiResponse<ISpecificMenu>>(
    `/menu/specific`,
    {
      params: query,
    },
  )
  return response.data
}

export async function createMenu(
  data: ICreateMenuRequest,
): Promise<IApiResponse<IMenu>> {
  const response = await http.post<IApiResponse<IMenu>>('/menu', data)
  return response.data
}

export async function updateMenu(
  data: IUpdateMenuRequest,
): Promise<IApiResponse<IMenu>> {
  const response = await http.patch<IApiResponse<IMenu>>('/menu', data)
  return response.data
}

export async function deleteMenu(slug: string): Promise<IApiResponse<IMenu>> {
  const response = await http.delete<IApiResponse<IMenu>>(`/menu/${slug}`)
  return response.data
}

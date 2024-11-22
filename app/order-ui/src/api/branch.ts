import { http } from '@/utils'
import { IApiResponse, ICreateBranchRequest, IBranch } from '@/types'

export async function getAllBranches(): Promise<IApiResponse<IBranch[]>> {
  const response = await http.get<IApiResponse<IBranch[]>>('/branch')
  return response.data
}

export async function createBranch(
  data: ICreateBranchRequest,
): Promise<IApiResponse<IBranch>> {
  const response = await http.post<IApiResponse<IBranch>>('/branch', data)
  return response.data
}

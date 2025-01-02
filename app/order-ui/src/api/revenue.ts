import { http } from '@/utils'
import { IApiResponse, IBranchRevenue, IBranchRevenueQuery } from '@/types'

export async function getBranchRevenue(
  params: IBranchRevenueQuery,
): Promise<IApiResponse<IBranchRevenue>> {
  const response = await http.get<IApiResponse<IBranchRevenue>>(
    `/revenue/branch/${params.branch}`,
    {
      params,
    },
  )
  return response.data
}

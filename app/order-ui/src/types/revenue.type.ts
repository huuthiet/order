export interface IBranchRevenue {
  slug: string
  branchId: string
  date: string
  totalAmount: number
  totalOrder: number
}

export interface IBranchRevenueQuery {
  branch: string
  startDate: string
  endDate: string
}

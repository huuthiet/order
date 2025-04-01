import { FC } from 'react'

import { ChefAreaSelect } from '@/components/app/select'
import { IChefOrders } from '@/types'
import { DataTableActionOptionsProps } from '@/components/ui'
import { useSelectedChefOrderStore, useUserStore } from '@/stores'
import { useGetChefAreas } from '@/hooks'

const ChefOrderActionOptions: FC<DataTableActionOptionsProps<IChefOrders>> = () => {
  const { userInfo } = useUserStore()
  const { data, isLoading } = useGetChefAreas(userInfo?.branch?.slug || '')
  const chefAreas = data?.result || []
  const { setChefOrderByChefAreaSlug, chefOrderByChefAreaSlug } = useSelectedChefOrderStore()

  if (isLoading) {
    return null // or a loading spinner if preferred
  }

  return (
    <ChefAreaSelect
      chefAreas={chefAreas}
      onSelect={setChefOrderByChefAreaSlug}
      value={chefOrderByChefAreaSlug}
    />
  )
}

export default ChefOrderActionOptions
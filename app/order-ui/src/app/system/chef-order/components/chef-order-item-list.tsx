import { ISpecificChefOrderItem } from '@/types'
import { ScrollArea } from '@/components/ui'
import ChefOrderItemDetail from './chef-order-item-detail'

interface IChefOrderItemListProps {
  chefOrderItemData?: ISpecificChefOrderItem[]
}

export default function ChefOrderItemList({
  chefOrderItemData,
}: IChefOrderItemListProps) {
  // console.log('chefOrderItemData in list', chefOrderItemData)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col w-full">
        <ScrollArea>
          {chefOrderItemData?.map((item) => (
            <div key={item.slug} className="grid gap-4 items-center w-full">
              <ChefOrderItemDetail chefOrderItem={item} />
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

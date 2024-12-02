import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SquareMenu } from 'lucide-react'

import { ScrollArea } from '@/components/ui'
import { useOrderBySlug } from '@/hooks'
import CustomerInformation from './customer-information'

export default function OrderDetailPage() {
    const { t } = useTranslation(['menu'])
    const { slug } = useParams()
    const { data: orderDetail } = useOrderBySlug(slug as string)
    // const { t: tCommon } = useTranslation(['common'])
    return (
        <div className="flex flex-row flex-1 gap-2">
            <ScrollArea className="flex-1">
                <div className='flex flex-col gap-4'>
                    <div className="flex flex-col">
                        <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pb-4 bg-background">
                            <span className="flex items-center justify-start w-full gap-1 text-lg">
                                <SquareMenu />
                                {t('order.orderDetail')} <span className='text-muted-foreground'>#{orderDetail?.result?.slug}</span>
                            </span>
                        </div>
                    </div>
                    <CustomerInformation orderDetailData={orderDetail?.result} />
                </div>
            </ScrollArea>
        </div>
    )
}

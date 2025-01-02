import { SquareMenu } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { RevenueSummary, RevenueChart, TopProducts, RevenueComparison } from './components'
import { useUserStore } from '@/stores'
import { useBranchRevenue } from '@/hooks'
import { BranchSelect, DateSelect } from '@/components/app/select'

export default function RevenuePage() {
    const { t } = useTranslation(['revenue'])
    const { userInfo } = useUserStore()
    // const chartRef = useRef<HTMLDivElement>(null)

    const { data } = useBranchRevenue({
        branch: userInfo?.branch.slug || '',
        startDate: '2024-12-01',
        endDate: '2024-12-30',
    })

    console.log(data?.result)
    const handleSelectBranch = (branch: string) => {
        console.log(branch)
    }
    return (
        <div className="min-h-screen">
            <main className='flex flex-col gap-2 pb-4'>
                <span className="flex items-center justify-between w-full gap-1 text-lg">
                    <div className='flex items-center gap-1'>
                        <SquareMenu />
                        {t('revenue.title')}
                    </div>
                    <div className='flex items-center gap-2'>
                        <BranchSelect onChange={handleSelectBranch} />
                        <DateSelect />
                    </div>
                </span>
                <RevenueSummary />
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <RevenueChart />
                    <TopProducts />
                </div>
                <RevenueComparison />
            </main>
        </div>
    )
}



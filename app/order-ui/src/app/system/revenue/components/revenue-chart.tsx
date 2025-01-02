import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateSelect } from '@/components/app/select'

const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
]

export default function RevenueChart() {
    const chartRef = useRef<HTMLDivElement>(null)
    const handleSelectTimeRange = (timeRange: string) => {
        console.log(timeRange)
    }

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current)

            const option = {
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'category',
                    data: data.map(item => item.name)
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '${value}'
                    }
                },
                series: [{
                    data: data.map(item => item.revenue),
                    type: 'line',
                    smooth: true
                }]
            }

            chart.setOption(option)

            const handleResize = () => {
                chart.resize()
            }

            window.addEventListener('resize', handleResize)

            return () => {
                chart.dispose()
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [])

    return (
        <Card className='shadow-none'>
            <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                    Revenue Trend
                    <DateSelect onChange={handleSelectTimeRange} />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
            </CardContent>
        </Card>
    )
}


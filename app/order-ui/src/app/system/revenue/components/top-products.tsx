"use client"

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { DateSelect } from '@/components/app/select'

const topProducts = [
    { name: 'Espresso', sales: 1234, revenue: 3702 },
    { name: 'Latte', sales: 1000, revenue: 3500 },
    { name: 'Cappuccino', sales: 856, revenue: 2996 },
    { name: 'Americano', sales: 821, revenue: 2463 },
    { name: 'Mocha', sales: 658, revenue: 2303 },
]

export default function TopProducts() {
    const chartRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current)

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['Sales', 'Revenue']
                },
                xAxis: {
                    type: 'category',
                    data: topProducts.map(product => product.name)
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'Sales',
                        type: 'bar',
                        data: topProducts.map(product => product.sales),
                        itemStyle: {
                            borderRadius: [5, 5, 0, 0]
                        }
                    },
                    {
                        name: 'Revenue',
                        type: 'bar',
                        data: topProducts.map(product => product.revenue),
                        itemStyle: {
                            borderRadius: [5, 5, 0, 0]
                        }
                    }
                ]
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

    const handleSelectTimeRange = (timeRange: string) => {
        console.log(timeRange)
    }

    return (
        <Card className='shadow-none'>
            <CardHeader >
                <CardTitle className='flex items-center justify-between'>Top Products
                    <DateSelect onChange={handleSelectTimeRange} />
                </CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
                <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
            </CardContent>
        </Card>
    )
}


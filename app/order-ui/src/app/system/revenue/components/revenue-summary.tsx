import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CoffeeIcon, TrendingUp, Users } from 'lucide-react'

export default function RevenueSummary() {
    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <CoffeeIcon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12,234</div>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
            </Card>
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$3.69</div>
                    <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                </CardContent>
            </Card>
            <Card className="shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Customers</CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3,120</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
            </Card>
        </div>
    )
}


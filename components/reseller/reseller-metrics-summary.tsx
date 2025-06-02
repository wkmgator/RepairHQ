import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, DollarSign, TrendingUp } from "lucide-react"

interface ResellerMetricsSummaryProps {
  totalReferrals: number
  convertedReferrals: number
  pendingCommissions: number
  paidCommissions: number
}

export function ResellerMetricsSummary({
  totalReferrals,
  convertedReferrals,
  pendingCommissions,
  paidCommissions,
}: ResellerMetricsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReferrals}</div>
          <p className="text-xs text-muted-foreground">Users who signed up via your link</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Converted Referrals</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{convertedReferrals}</div>
          <p className="text-xs text-muted-foreground">Referrals that led to a conversion</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${pendingCommissions.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Potential earnings awaiting approval</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Paid Commissions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${paidCommissions.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total commissions paid out</p>
        </CardContent>
      </Card>
    </div>
  )
}

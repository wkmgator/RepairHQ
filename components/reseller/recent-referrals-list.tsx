import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Referral } from "@/lib/reseller-service" // Assuming Referral type is defined here
import { format } from "date-fns"

interface RecentReferralsListProps {
  referrals: Referral[]
}

export function RecentReferralsList({ referrals }: RecentReferralsListProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "approved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Referrals</CardTitle>
        <CardDescription>Latest users who signed up using your referral link.</CardDescription>
      </CardHeader>
      <CardContent>
        {referrals.length === 0 ? (
          <p className="text-muted-foreground">No recent referrals found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referred User ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-mono text-xs">{referral.referred_user_id.substring(0, 12)}...</TableCell>
                  <TableCell>{format(new Date(referral.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>{referral.conversion_type}</TableCell>
                  <TableCell>${referral.commission_earned.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(referral.commission_status)}>
                      {referral.commission_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

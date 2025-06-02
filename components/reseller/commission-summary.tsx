import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { CommissionPayout } from "@/lib/reseller-service"
import { format } from "date-fns"

interface CommissionSummaryProps {
  payouts: CommissionPayout[]
}

export function CommissionSummary({ payouts }: CommissionSummaryProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "secondary"
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Payouts</CardTitle>
        <CardDescription>History of your commission payouts.</CardDescription>
      </CardHeader>
      <CardContent>
        {payouts.length === 0 ? (
          <p className="text-muted-foreground">No payouts processed yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{format(new Date(payout.payout_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(payout.status)}>{payout.status}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {payout.transaction_reference?.substring(0, 12) || "N/A"}
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

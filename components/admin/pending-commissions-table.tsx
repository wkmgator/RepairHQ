"use client"

import type { Referral } from "@/lib/reseller-service"
import { approveCommissionAction, rejectCommissionAction } from "@/app/admin/commissions/actions"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useState, useTransition } from "react"
import { format } from "date-fns"

interface PendingCommissionsTableProps {
  pendingCommissions: Referral[]
}

export function PendingCommissionsTable({ pendingCommissions }: PendingCommissionsTableProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [commissionList, setCommissionList] = useState(pendingCommissions)

  const handleAction = async (action: "approve" | "reject", referralId: string) => {
    startTransition(async () => {
      const result =
        action === "approve" ? await approveCommissionAction(referralId) : await rejectCommissionAction(referralId)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        // Remove the item from the local list to update UI immediately
        setCommissionList((prev) => prev.filter((c) => c.id !== referralId))
      } else {
        toast({
          title: "Error",
          description: result.message + (result.error ? ` (${result.error})` : ""),
          variant: "destructive",
        })
      }
    })
  }

  if (!commissionList || commissionList.length === 0) {
    return <p className="text-center text-gray-500 py-8">No pending commissions found.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Referral ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Reseller Email</TableHead>
          <TableHead>Referred User Email</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {commissionList.map((commission) => (
          <TableRow key={commission.id}>
            <TableCell className="font-medium truncate max-w-[100px]" title={commission.id}>
              {commission.id}
            </TableCell>
            <TableCell>{format(new Date(commission.created_at), "PPpp")}</TableCell>
            <TableCell>{commission.reseller_user_email || "N/A"}</TableCell>
            <TableCell>{commission.referred_user_email || "N/A"}</TableCell>
            <TableCell>{commission.conversion_type}</TableCell>
            <TableCell className="text-right">${commission.commission_earned.toFixed(2)}</TableCell>
            <TableCell className="text-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleAction("approve", commission.id)}
                disabled={isPending}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleAction("reject", commission.id)}
                disabled={isPending}
              >
                Reject
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

"use client"

import { useState, useEffect, useTransition } from "react"
import {
  fetchResellersWithPayableCommissionsAction,
  fetchApprovedUnpaidCommissionsForResellerAction,
  processPayoutAction,
} from "@/app/admin/payouts/actions"
import type { ResellerPayableSummary, Referral } from "@/lib/reseller-service"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency, formatDate } from "@/lib/format-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function PayoutProcessor({
  initialResellersData,
  initialError,
}: {
  initialResellersData: ResellerPayableSummary[] | null
  initialError?: string
}) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [isLoadingDetails, startDetailsTransition] = useTransition()

  const [resellers, setResellers] = useState<ResellerPayableSummary[]>(initialResellersData || [])
  const [selectedReseller, setSelectedReseller] = useState<ResellerPayableSummary | null>(null)
  const [commissions, setCommissions] = useState<Referral[]>([])
  const [selectedCommissionIds, setSelectedCommissionIds] = useState<string[]>([])

  const [paymentMethod, setPaymentMethod] = useState("")
  const [transactionReference, setTransactionReference] = useState("")
  const [error, setError] = useState<string | null>(initialError || null)

  useEffect(() => {
    if (initialResellersData) {
      setResellers(initialResellersData)
    }
    if (initialError) {
      setError(initialError)
    }
  }, [initialResellersData, initialError])

  const handleSelectReseller = (reseller: ResellerPayableSummary) => {
    setSelectedReseller(reseller)
    setCommissions([])
    setSelectedCommissionIds([])
    setError(null)
    startDetailsTransition(async () => {
      const response = await fetchApprovedUnpaidCommissionsForResellerAction(reseller.reseller_id)
      if (response.success && response.data) {
        setCommissions(response.data as Referral[])
      } else {
        setError(response.message)
        toast({
          variant: "destructive",
          title: "Error fetching commissions",
          description: response.message,
        })
      }
    })
  }

  const handleToggleCommission = (commissionId: string) => {
    setSelectedCommissionIds((prev) =>
      prev.includes(commissionId) ? prev.filter((id) => id !== commissionId) : [...prev, commissionId],
    )
  }

  const handleToggleSelectAllCommissions = () => {
    if (selectedCommissionIds.length === commissions.length) {
      setSelectedCommissionIds([])
    } else {
      setSelectedCommissionIds(commissions.map((c) => c.id))
    }
  }

  const calculatedPayoutAmount = commissions
    .filter((c) => selectedCommissionIds.includes(c.id))
    .reduce((sum, c) => sum + c.commission_earned, 0)

  const handleProcessPayout = () => {
    if (!selectedReseller || calculatedPayoutAmount <= 0 || !paymentMethod || selectedCommissionIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a reseller, commissions, and enter payment details.",
      })
      return
    }
    setError(null)
    startTransition(async () => {
      const response = await processPayoutAction(
        selectedReseller.reseller_id,
        calculatedPayoutAmount,
        paymentMethod,
        transactionReference,
        selectedCommissionIds,
      )
      if (response.success) {
        toast({
          title: "Payout Processed",
          description: `Payout of ${formatCurrency(calculatedPayoutAmount)} for ${selectedReseller.reseller_email} recorded.`,
        })
        // Reset and refresh
        setSelectedReseller(null)
        setCommissions([])
        setSelectedCommissionIds([])
        setPaymentMethod("")
        setTransactionReference("")
        // Refresh reseller list
        const refreshResponse = await fetchResellersWithPayableCommissionsAction()
        if (refreshResponse.success && refreshResponse.data) {
          setResellers(refreshResponse.data as ResellerPayableSummary[])
        }
      } else {
        setError(response.message)
        toast({
          variant: "destructive",
          title: "Payout Failed",
          description: response.message,
        })
      }
    })
  }

  if (error && !initialResellersData?.length) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Payout Data</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Resellers with Payable Commissions</CardTitle>
          <CardDescription>Select a reseller to view and process their payout.</CardDescription>
        </CardHeader>
        <CardContent>
          {resellers.length === 0 && !isPending && <p>No resellers currently have payable commissions.</p>}
          {isPending && !selectedReseller && <Loader2 className="h-6 w-6 animate-spin mx-auto" />}
          <ul className="space-y-2">
            {resellers.map((r) => (
              <li key={r.reseller_id}>
                <Button
                  variant={selectedReseller?.reseller_id === r.reseller_id ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => handleSelectReseller(r)}
                  disabled={isLoadingDetails}
                >
                  <span>{r.reseller_email}</span>
                  <span className="font-semibold">{formatCurrency(r.total_payable_amount)}</span>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {selectedReseller && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Process Payout for {selectedReseller.reseller_email}</CardTitle>
            <CardDescription>
              Total payable: {formatCurrency(selectedReseller.total_payable_amount)}. Select commissions to include in
              this payout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDetails && <Loader2 className="h-6 w-6 animate-spin mx-auto my-4" />}
            {!isLoadingDetails && commissions.length === 0 && (
              <p>No approved unpaid commissions found for this reseller.</p>
            )}
            {!isLoadingDetails && commissions.length > 0 && (
              <>
                <div className="mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedCommissionIds.length === commissions.length && commissions.length > 0}
                            onCheckedChange={handleToggleSelectAllCommissions}
                            aria-label="Select all commissions"
                          />
                        </TableHead>
                        <TableHead>Referred User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissions.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedCommissionIds.includes(c.id)}
                              onCheckedChange={() => handleToggleCommission(c.id)}
                            />
                          </TableCell>
                          <TableCell>{c.referred_user_email || c.referred_user_id}</TableCell>
                          <TableCell>{c.conversion_type}</TableCell>
                          <TableCell>{formatDate(c.created_at)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(c.commission_earned)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="space-y-4 mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold">Payout Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Input
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        placeholder="e.g., PayPal, Bank Transfer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="transactionReference">Transaction Reference</Label>
                      <Input
                        id="transactionReference"
                        value={transactionReference}
                        onChange={(e) => setTransactionReference(e.target.value)}
                        placeholder="e.g., PayPal Tx ID, Bank Ref No."
                      />
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    Selected Payout Amount: {formatCurrency(calculatedPayoutAmount)}
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleProcessPayout}
              disabled={
                isPending ||
                isLoadingDetails ||
                !selectedReseller ||
                calculatedPayoutAmount <= 0 ||
                !paymentMethod ||
                selectedCommissionIds.length === 0
              }
              className="ml-auto"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Process Payout
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

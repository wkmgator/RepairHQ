"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getSupabaseClient } from "@/lib/supabase-pos"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Printer, Download, RefreshCw, RotateCcw, Mail, MessageSquare, Copy } from "lucide-react"

interface Transaction {
  id: string
  transaction_number: string
  total_amount: number
  tax_amount: number
  discount_amount: number
  payment_method: string
  payment_status: string
  created_at: string
  customer: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
  } | null
  employee: {
    id: string
    first_name: string
    last_name: string
  } | null
  items: Array<{
    id: string
    name: string
    quantity: number
    unit_price: number
    total: number
  }>
}

interface TransactionDetailsProps {
  transaction: Transaction
}

export default function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const [isRefunding, setIsRefunding] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to refund this transaction?")) {
      return
    }

    try {
      setIsRefunding(true)

      const { error } = await supabase
        .from("pos_transactions")
        .update({
          payment_status: "refunded",
        })
        .eq("id", transaction.id)

      if (error) throw error

      toast({
        title: "Transaction Refunded",
        description: `Transaction ${transaction.transaction_number} has been refunded.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error refunding transaction:", error)
      toast({
        title: "Refund Failed",
        description: "Failed to refund transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefunding(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "refunded":
        return "outline"
      default:
        return "secondary"
    }
  }

  const subtotal = transaction.total_amount - transaction.tax_amount + transaction.discount_amount

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="icon" asChild className="mr-4">
            <Link href="/pos/transactions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Transaction Details</h1>
        </div>
        <Badge variant={getStatusBadgeVariant(transaction.payment_status)} className="text-base">
          {transaction.payment_status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Receipt</CardTitle>
              <CardDescription>Transaction #{transaction.transaction_number}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold">RepairHQ</h2>
                  <p className="text-sm text-muted-foreground">123 Main Street, New York, NY 10001</p>
                  <p className="text-sm text-muted-foreground">(555) 123-4567 | info@repairhq.com</p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Transaction #:</span>
                    <span>{transaction.transaction_number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Date:</span>
                    <span>{formatDate(transaction.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cashier:</span>
                    <span>
                      {transaction.employee
                        ? `${transaction.employee.first_name} ${transaction.employee.last_name}`
                        : "Unknown"}
                    </span>
                  </div>
                  {transaction.customer && (
                    <div className="flex justify-between text-sm">
                      <span>Customer:</span>
                      <span>
                        {transaction.customer.first_name} {transaction.customer.last_name}
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="mb-4">
                  <div className="grid grid-cols-12 font-medium text-sm mb-2">
                    <div className="col-span-6">Item</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">Qty</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {transaction.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 text-sm py-1">
                      <div className="col-span-6">{item.name}</div>
                      <div className="col-span-2 text-right">{formatCurrency(item.unit_price)}</div>
                      <div className="col-span-2 text-right">{item.quantity}</div>
                      <div className="col-span-2 text-right">{formatCurrency(item.total)}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {transaction.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>-{formatCurrency(transaction.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>{formatCurrency(transaction.tax_amount)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(transaction.total_amount)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Payment Method:</span>
                    <span className="capitalize">{transaction.payment_method}</span>
                  </div>
                </div>

                <div className="text-center text-sm mt-6">
                  <p>Thank you for your business!</p>
                  <p className="text-muted-foreground">www.repairhq.com</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  SMS
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
                <div className="mt-1 text-2xl font-bold">{formatCurrency(transaction.total_amount)}</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={getStatusBadgeVariant(transaction.payment_status)}>
                    {transaction.payment_status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method:</span>
                  <span className="text-sm capitalize">{transaction.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm">{formatDate(transaction.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Items:</span>
                  <span className="text-sm">{transaction.items.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {transaction.customer && (
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="text-sm">
                    {transaction.customer.first_name} {transaction.customer.last_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="text-sm">{transaction.customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">{transaction.customer.email}</span>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/customers/${transaction.customer.id}`}>View Customer Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {transaction.payment_status === "completed" && (
                <Button variant="outline" className="w-full" onClick={handleRefund} disabled={isRefunding}>
                  {isRefunding ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Refund Transaction
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/pos">New Transaction</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

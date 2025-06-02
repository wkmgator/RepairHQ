"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Printer, ArrowLeft } from "lucide-react"
import { format } from "date-fns"

// Client-side component for handling print functionality and UI rendering
export default function TransactionDetailsComponent({ transaction }: { transaction: any }) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 500)
  }

  // Calculate totals
  const subtotal = transaction.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
            Print Receipt
          </Button>
        </div>
      </div>

      <div className="print:block" id="receipt">
        <Card className="print:border-none print:shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">RepairHQ</CardTitle>
            <p className="text-sm text-gray-500">123 Repair Street, Fixville</p>
            <p className="text-sm text-gray-500">Tel: (555) 123-4567</p>
            <div className="mt-2">
              <h2 className="text-xl font-bold">Receipt</h2>
              <p className="text-sm text-gray-500">Transaction #: {transaction.transaction_number}</p>
              <p className="text-sm text-gray-500">
                Date: {transaction.created_at ? format(new Date(transaction.created_at), "MMM dd, yyyy h:mm a") : "N/A"}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {transaction.customer && (
              <div className="mb-4">
                <h3 className="font-semibold">Customer:</h3>
                <p>
                  {transaction.customer.first_name} {transaction.customer.last_name}
                </p>
                <p className="text-sm text-gray-500">{transaction.customer.email}</p>
                <p className="text-sm text-gray-500">{transaction.customer.phone}</p>
              </div>
            )}

            <Separator className="my-4" />

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Item</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">${item.unit_price.toFixed(2)}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">${(item.unit_price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${transaction.discount_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${transaction.tax_amount.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${transaction.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="capitalize">{transaction.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="capitalize">{transaction.payment_status}</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm">Thank you for your business!</p>
              <p className="text-xs text-gray-500">
                For returns or exchanges, please present this receipt within 30 days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

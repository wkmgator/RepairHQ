"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, CreditCard, DollarSign, Gift } from "lucide-react"

interface SplitPayment {
  id: string
  method: string
  amount: number
  reference?: string
}

interface SplitPaymentManagerProps {
  totalAmount: number
  onPaymentsChange: (payments: SplitPayment[]) => void
  onComplete: () => void
}

export default function SplitPaymentManager({ totalAmount, onPaymentsChange, onComplete }: SplitPaymentManagerProps) {
  const [payments, setPayments] = useState<SplitPayment[]>([])
  const [newPayment, setNewPayment] = useState({
    method: "cash",
    amount: 0,
    reference: "",
  })

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const remaining = totalAmount - totalPaid

  const addPayment = () => {
    if (newPayment.amount <= 0 || newPayment.amount > remaining) {
      return
    }

    const payment: SplitPayment = {
      id: Math.random().toString(),
      method: newPayment.method,
      amount: newPayment.amount,
      reference: newPayment.reference || undefined,
    }

    const updatedPayments = [...payments, payment]
    setPayments(updatedPayments)
    onPaymentsChange(updatedPayments)

    // Reset form
    setNewPayment({
      method: "cash",
      amount: 0,
      reference: "",
    })
  }

  const removePayment = (id: string) => {
    const updatedPayments = payments.filter((p) => p.id !== id)
    setPayments(updatedPayments)
    onPaymentsChange(updatedPayments)
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <DollarSign className="h-4 w-4" />
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "gift_card":
        return <Gift className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "cash":
        return "Cash"
      case "card":
        return "Credit/Debit Card"
      case "gift_card":
        return "Gift Card"
      case "store_credit":
        return "Store Credit"
      case "check":
        return "Check"
      default:
        return method
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Split Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-lg font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-lg font-bold text-green-600">${totalPaid.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="text-lg font-bold text-red-600">${remaining.toFixed(2)}</p>
            </div>
          </div>

          {remaining > 0 && (
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Add Payment</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    value={newPayment.method}
                    onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="gift_card">Gift Card</SelectItem>
                      <SelectItem value="store_credit">Store Credit</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={remaining}
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {(newPayment.method === "card" || newPayment.method === "gift_card" || newPayment.method === "check") && (
                <div className="space-y-2">
                  <Label>Reference Number</Label>
                  <Input
                    value={newPayment.reference}
                    onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                    placeholder="Transaction ID, Gift Card Number, Check Number, etc."
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={addPayment}
                  disabled={newPayment.amount <= 0 || newPayment.amount > remaining}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setNewPayment({ ...newPayment, amount: remaining })}
                  disabled={remaining <= 0}
                >
                  Pay Remaining
                </Button>
              </div>
            </div>
          )}

          {payments.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Payment Methods</h3>
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getPaymentIcon(payment.method)}
                    <div>
                      <p className="font-medium">{getPaymentMethodName(payment.method)}</p>
                      {payment.reference && <p className="text-sm text-gray-500">Ref: {payment.reference}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">${payment.amount.toFixed(2)}</Badge>
                    <Button size="icon" variant="ghost" onClick={() => removePayment(payment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={onComplete} disabled={remaining > 0} className="flex-1">
              {remaining > 0 ? `$${remaining.toFixed(2)} Remaining` : "Complete Split Payment"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Clock, DollarSign, Package } from "lucide-react"
import { format } from "date-fns"

interface LayawayItem {
  id: string
  customer_id: string
  customer_name: string
  total_amount: number
  deposit_amount: number
  remaining_balance: number
  due_date: string
  status: string
  items: any[]
  created_at: string
  payments: any[]
}

export default function LayawayManagement() {
  const { toast } = useToast()
  const [layaways, setLayaways] = useState<LayawayItem[]>([])
  const [selectedLayaway, setSelectedLayaway] = useState<LayawayItem | null>(null)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLayaways()
  }, [])

  const loadLayaways = async () => {
    try {
      setIsLoading(true)
      // Load layaways from database
      // This would be replaced with actual API call
      const mockLayaways: LayawayItem[] = [
        {
          id: "1",
          customer_id: "cust1",
          customer_name: "John Doe",
          total_amount: 500.0,
          deposit_amount: 100.0,
          remaining_balance: 400.0,
          due_date: "2024-02-15",
          status: "active",
          items: [
            { name: "iPhone Screen Repair", price: 300.0, quantity: 1 },
            { name: "Phone Case", price: 200.0, quantity: 1 },
          ],
          created_at: "2024-01-15",
          payments: [{ amount: 100.0, date: "2024-01-15", method: "cash" }],
        },
      ]
      setLayaways(mockLayaways)
    } catch (error) {
      console.error("Error loading layaways:", error)
      toast({
        title: "Error",
        description: "Failed to load layaways",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const makePayment = async () => {
    if (!selectedLayaway || paymentAmount <= 0) return

    try {
      // Process payment
      const updatedBalance = selectedLayaway.remaining_balance - paymentAmount

      // Update layaway status if fully paid
      const newStatus = updatedBalance <= 0 ? "completed" : "active"

      toast({
        title: "Payment Processed",
        description: `Payment of $${paymentAmount.toFixed(2)} processed successfully`,
      })

      // Reload layaways
      loadLayaways()
      setSelectedLayaway(null)
      setPaymentAmount(0)
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment",
        variant: "destructive",
      })
    }
  }

  const completeLayaway = async (layaway: LayawayItem) => {
    try {
      // Convert layaway to regular sale
      toast({
        title: "Layaway Completed",
        description: `Layaway for ${layaway.customer_name} has been completed`,
      })
      loadLayaways()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete layaway",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "expired":
        return "destructive"
      case "cancelled":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (isLoading) {
    return <div className="p-4">Loading layaways...</div>
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {layaways
              .filter((l) => l.status === "active")
              .map((layaway) => (
                <Card key={layaway.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{layaway.customer_name}</CardTitle>
                      <Badge variant={getStatusColor(layaway.status)}>{layaway.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-bold">${layaway.total_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Paid</p>
                        <p className="font-bold text-green-600">${layaway.deposit_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Remaining</p>
                        <p className="font-bold text-red-600">${layaway.remaining_balance.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-bold">{format(new Date(layaway.due_date), "MMM dd, yyyy")}</p>
                        <p className="text-xs text-gray-500">{getDaysUntilDue(layaway.due_date)} days</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Items:</p>
                      <div className="space-y-1">
                        {layaway.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {item.name} x{item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={() => setSelectedLayaway(layaway)} className="flex-1">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Make Payment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => completeLayaway(layaway)}
                        disabled={layaway.remaining_balance > 0}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {layaways.filter((l) => l.status === "active").length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No active layaways found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-4">
            {layaways
              .filter((l) => l.status === "completed")
              .map((layaway) => (
                <Card key={layaway.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{layaway.customer_name}</CardTitle>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Completed on {format(new Date(layaway.due_date), "MMM dd, yyyy")}
                    </p>
                    <p className="font-bold">${layaway.total_amount.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="expired">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No expired layaways</p>
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid gap-4">
            {layaways.map((layaway) => (
              <Card key={layaway.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{layaway.customer_name}</CardTitle>
                    <Badge variant={getStatusColor(layaway.status)}>{layaway.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-bold">${layaway.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Remaining</p>
                      <p className="font-bold">${layaway.remaining_balance.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-bold">{format(new Date(layaway.due_date), "MMM dd")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      {selectedLayaway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Make Payment</CardTitle>
              <p className="text-sm text-gray-500">
                {selectedLayaway.customer_name} - Remaining: ${selectedLayaway.remaining_balance.toFixed(2)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedLayaway.remaining_balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setSelectedLayaway(null)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={makePayment}
                  disabled={paymentAmount <= 0 || paymentAmount > selectedLayaway.remaining_balance}
                  className="flex-1"
                >
                  Process Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

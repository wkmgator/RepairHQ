"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { RotateCcw, ArrowLeftRight, Search, Package, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { advancedPOSService } from "@/lib/advanced-pos-service"

interface ReturnItem {
  id: string
  original_transaction_id: string
  customer_name: string
  return_amount: number
  reason: string
  status: string
  items: any[]
  created_at: string
  processed_by: string
}

interface ExchangeItem {
  id: string
  original_transaction_id: string
  customer_name: string
  original_items: any[]
  exchange_items: any[]
  price_difference: number
  status: string
  created_at: string
}

export default function ReturnsExchanges() {
  const { toast } = useToast()
  const [returns, setReturns] = useState<ReturnItem[]>([])
  const [exchanges, setExchanges] = useState<ExchangeItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [showExchangeDialog, setShowExchangeDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Return form state
  const [returnReason, setReturnReason] = useState("")
  const [returnItems, setReturnItems] = useState<any[]>([])
  const [returnMethod, setReturnMethod] = useState("original")

  // Exchange form state
  const [exchangeReason, setExchangeReason] = useState("")
  const [originalItems, setOriginalItems] = useState<any[]>([])
  const [newItems, setNewItems] = useState<any[]>([])

  useEffect(() => {
    loadReturnsAndExchanges()
  }, [])

  const loadReturnsAndExchanges = async () => {
    try {
      setIsLoading(true)

      // Mock data - replace with actual API calls
      const mockReturns: ReturnItem[] = [
        {
          id: "1",
          original_transaction_id: "TX-123456",
          customer_name: "John Doe",
          return_amount: 150.0,
          reason: "Defective product",
          status: "completed",
          items: [{ name: "iPhone Screen Repair", quantity: 1, price: 150.0 }],
          created_at: "2024-01-20",
          processed_by: "Jane Smith",
        },
      ]

      const mockExchanges: ExchangeItem[] = [
        {
          id: "1",
          original_transaction_id: "TX-789012",
          customer_name: "Alice Johnson",
          original_items: [{ name: "Phone Case - Blue", quantity: 1, price: 25.0 }],
          exchange_items: [{ name: "Phone Case - Red", quantity: 1, price: 25.0 }],
          price_difference: 0,
          status: "completed",
          created_at: "2024-01-18",
        },
      ]

      setReturns(mockReturns)
      setExchanges(mockExchanges)
    } catch (error) {
      console.error("Error loading returns and exchanges:", error)
      toast({
        title: "Error",
        description: "Failed to load returns and exchanges",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const searchTransaction = async (transactionId: string) => {
    try {
      // Mock transaction search - replace with actual API call
      const mockTransaction = {
        id: transactionId,
        customer_name: "John Doe",
        total_amount: 200.0,
        items: [
          { id: "1", name: "iPhone Screen Repair", quantity: 1, price: 150.0, returnable: true },
          { id: "2", name: "Screen Protector", quantity: 1, price: 50.0, returnable: true },
        ],
        created_at: "2024-01-15",
        payment_method: "card",
      }

      setSelectedTransaction(mockTransaction)
      setReturnItems(mockTransaction.items.map((item) => ({ ...item, selected: false, return_quantity: 0 })))
      setOriginalItems(mockTransaction.items.map((item) => ({ ...item, selected: false, exchange_quantity: 0 })))
    } catch (error) {
      toast({
        title: "Transaction Not Found",
        description: "Could not find transaction with that ID",
        variant: "destructive",
      })
    }
  }

  const processReturn = async () => {
    if (!selectedTransaction || returnItems.filter((item) => item.selected).length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to return",
        variant: "destructive",
      })
      return
    }

    if (!returnReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the return",
        variant: "destructive",
      })
      return
    }

    try {
      const itemsToReturn = returnItems.filter((item) => item.selected)

      const result = await advancedPOSService.processReturn(selectedTransaction.id, itemsToReturn, returnReason)

      if (result.success) {
        toast({
          title: "Return Processed",
          description: `Return processed successfully`,
        })

        setShowReturnDialog(false)
        setSelectedTransaction(null)
        setReturnItems([])
        setReturnReason("")
        loadReturnsAndExchanges()
      }
    } catch (error) {
      toast({
        title: "Return Failed",
        description: "Failed to process return",
        variant: "destructive",
      })
    }
  }

  const processExchange = async () => {
    if (!selectedTransaction || originalItems.filter((item) => item.selected).length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to exchange",
        variant: "destructive",
      })
      return
    }

    try {
      // Process exchange logic here
      toast({
        title: "Exchange Processed",
        description: "Exchange processed successfully",
      })

      setShowExchangeDialog(false)
      setSelectedTransaction(null)
      setOriginalItems([])
      setNewItems([])
      setExchangeReason("")
      loadReturnsAndExchanges()
    } catch (error) {
      toast({
        title: "Exchange Failed",
        description: "Failed to process exchange",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const calculateReturnTotal = () => {
    return returnItems.filter((item) => item.selected).reduce((sum, item) => sum + item.price * item.return_quantity, 0)
  }

  const calculateExchangeDifference = () => {
    const originalTotal = originalItems
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * item.exchange_quantity, 0)

    const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return newTotal - originalTotal
  }

  if (isLoading) {
    return <div className="p-4">Loading returns and exchanges...</div>
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Returns & Exchanges</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowReturnDialog(true)}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Process Return
          </Button>
          <Button variant="outline" onClick={() => setShowExchangeDialog(true)}>
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Process Exchange
          </Button>
        </div>
      </div>

      <Tabs defaultValue="returns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          <TabsTrigger value="search">Search Transaction</TabsTrigger>
        </TabsList>

        <TabsContent value="returns" className="space-y-4">
          <div className="grid gap-4">
            {returns.map((returnItem) => (
              <Card key={returnItem.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Return #{returnItem.id}</CardTitle>
                    <Badge variant={getStatusColor(returnItem.status)}>{returnItem.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{returnItem.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Return Amount</p>
                      <p className="font-bold text-green-600">${returnItem.return_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Original Transaction</p>
                      <p className="font-mono text-sm">{returnItem.original_transaction_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{format(new Date(returnItem.created_at), "MMM dd, yyyy")}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Reason:</p>
                    <p className="text-sm">{returnItem.reason}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Items:</p>
                    <div className="space-y-1">
                      {returnItem.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">Processed by: {returnItem.processed_by}</div>
                </CardContent>
              </Card>
            ))}

            {returns.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <RotateCcw className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No returns found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="exchanges" className="space-y-4">
          <div className="grid gap-4">
            {exchanges.map((exchange) => (
              <Card key={exchange.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Exchange #{exchange.id}</CardTitle>
                    <Badge variant={getStatusColor(exchange.status)}>{exchange.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{exchange.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price Difference</p>
                      <p className={`font-bold ${exchange.price_difference >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {exchange.price_difference >= 0 ? "+" : ""}${exchange.price_difference.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Original Transaction</p>
                      <p className="font-mono text-sm">{exchange.original_transaction_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{format(new Date(exchange.created_at), "MMM dd, yyyy")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Original Items:</p>
                      <div className="space-y-1">
                        {exchange.original_items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Exchange Items:</p>
                      <div className="space-y-1">
                        {exchange.exchange_items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {exchanges.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No exchanges found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter transaction ID or receipt number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => searchTransaction(searchQuery)}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {selectedTransaction && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Transaction Found</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{selectedTransaction.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-bold">${selectedTransaction.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{format(new Date(selectedTransaction.created_at), "MMM dd, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium capitalize">{selectedTransaction.payment_method}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Items:</p>
                    <div className="space-y-1">
                      {selectedTransaction.items.map((item: any, index: number) => (
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
                    <Button onClick={() => setShowReturnDialog(true)} className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Process Return
                    </Button>
                    <Button variant="outline" onClick={() => setShowExchangeDialog(true)} className="flex-1">
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Process Exchange
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Process Return Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!selectedTransaction ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Please search for a transaction first</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReturnDialog(false)
                    // Switch to search tab
                  }}
                  className="mt-4"
                >
                  Search Transaction
                </Button>
              </div>
            ) : (
              <>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Transaction: {selectedTransaction.id}</h3>
                  <p className="text-sm text-gray-500">Customer: {selectedTransaction.customer_name}</p>
                </div>

                <div className="space-y-2">
                  <Label>Select Items to Return</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {returnItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                        <Checkbox
                          checked={item.selected}
                          onCheckedChange={(checked) => {
                            const updated = [...returnItems]
                            updated[index].selected = checked
                            if (checked) {
                              updated[index].return_quantity = item.quantity
                            } else {
                              updated[index].return_quantity = 0
                            }
                            setReturnItems(updated)
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                        {item.selected && (
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Qty:</Label>
                            <Input
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={item.return_quantity}
                              onChange={(e) => {
                                const updated = [...returnItems]
                                updated[index].return_quantity = Number(e.target.value)
                                setReturnItems(updated)
                              }}
                              className="w-16"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Return Reason</Label>
                  <Select value={returnReason} onValueChange={setReturnReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defective">Defective Product</SelectItem>
                      <SelectItem value="wrong_item">Wrong Item</SelectItem>
                      <SelectItem value="not_satisfied">Customer Not Satisfied</SelectItem>
                      <SelectItem value="damaged">Damaged in Transit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Return Method</Label>
                  <Select value={returnMethod} onValueChange={setReturnMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original Payment Method</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="store_credit">Store Credit</SelectItem>
                      <SelectItem value="gift_card">Gift Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Return Total:</span>
                    <span className="text-xl font-bold">${calculateReturnTotal().toFixed(2)}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setShowReturnDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={processReturn} disabled={calculateReturnTotal() === 0} className="flex-1">
                      Process Return
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Process Exchange Dialog */}
      <Dialog open={showExchangeDialog} onOpenChange={setShowExchangeDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Process Exchange</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!selectedTransaction ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Please search for a transaction first</p>
                <Button variant="outline" onClick={() => setShowExchangeDialog(false)} className="mt-4">
                  Search Transaction
                </Button>
              </div>
            ) : (
              <>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Transaction: {selectedTransaction.id}</h3>
                  <p className="text-sm text-gray-500">Customer: {selectedTransaction.customer_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium">Original Items</Label>
                    <div className="space-y-2 mt-2">
                      {originalItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                          <Checkbox
                            checked={item.selected}
                            onCheckedChange={(checked) => {
                              const updated = [...originalItems]
                              updated[index].selected = checked
                              if (checked) {
                                updated[index].exchange_quantity = item.quantity
                              } else {
                                updated[index].exchange_quantity = 0
                              }
                              setOriginalItems(updated)
                            }}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                          </div>
                          {item.selected && (
                            <div className="flex items-center space-x-2">
                              <Label className="text-sm">Qty:</Label>
                              <Input
                                type="number"
                                min="1"
                                max={item.quantity}
                                value={item.exchange_quantity}
                                onChange={(e) => {
                                  const updated = [...originalItems]
                                  updated[index].exchange_quantity = Number(e.target.value)
                                  setOriginalItems(updated)
                                }}
                                className="w-16"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">New Items</Label>
                    <div className="space-y-2 mt-2">
                      <Button variant="outline" className="w-full">
                        <Package className="h-4 w-4 mr-2" />
                        Add Items
                      </Button>
                      {newItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} x {item.quantity}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Exchange Reason</Label>
                  <Textarea
                    value={exchangeReason}
                    onChange={(e) => setExchangeReason(e.target.value)}
                    placeholder="Enter reason for exchange..."
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Price Difference:</span>
                    <span
                      className={`text-xl font-bold ${calculateExchangeDifference() >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {calculateExchangeDifference() >= 0 ? "+" : ""}${calculateExchangeDifference().toFixed(2)}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setShowExchangeDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      onClick={processExchange}
                      disabled={originalItems.filter((item) => item.selected).length === 0}
                      className="flex-1"
                    >
                      Process Exchange
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

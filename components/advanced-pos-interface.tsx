"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  ShoppingCart,
  CreditCard,
  DollarSign,
  Gift,
  Users,
  Receipt,
  ArrowLeftRight,
  Clock,
  Printer,
  Mail,
  MessageSquare,
  Star,
  Scan,
  Search,
  Plus,
  Minus,
  Trash2,
} from "lucide-react"
import { advancedPOSService } from "@/lib/advanced-pos-service"
import { BarcodeScannerModal } from "@/components/barcode-scanner-modal"

interface CartItem {
  id: string
  inventory_id: string
  name: string
  sku: string
  price: number
  quantity: number
  tax_rate: number
  category: string
  discount?: number
}

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  loyalty_points: number
  store_credit: number
  loyalty_tier: string
}

export default function AdvancedPOSInterface() {
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")
  const [splitPayments, setSplitPayments] = useState<any[]>([])
  const [discountCode, setDiscountCode] = useState("")
  const [manualDiscount, setManualDiscount] = useState(0)
  const [taxBreakdown, setTaxBreakdown] = useState<any[]>([])
  const [showSplitPayment, setShowSplitPayment] = useState(false)
  const [showLayaway, setShowLayaway] = useState(false)
  const [showGiftCard, setShowGiftCard] = useState(false)
  const [showReturns, setShowReturns] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [receiptTemplate, setReceiptTemplate] = useState("default")
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0)
  const [storeCreditToUse, setStoreCreditToUse] = useState(0)

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalDiscount = calculateTotalDiscount()
  const totalTax = taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0)
  const loyaltyDiscount = loyaltyPointsToUse * 0.01 // 1 point = $0.01
  const creditDiscount = Math.min(storeCreditToUse, subtotal - totalDiscount)
  const finalTotal = subtotal - totalDiscount - loyaltyDiscount - creditDiscount + totalTax

  function calculateTotalDiscount() {
    let discount = 0

    // Manual discount
    if (manualDiscount > 0) {
      discount += subtotal * (manualDiscount / 100)
    }

    // Item-specific discounts
    cart.forEach((item) => {
      if (item.discount) {
        discount += item.price * item.quantity * (item.discount / 100)
      }
    })

    return discount
  }

  // Add item to cart
  const addToCart = (item: any) => {
    const existingIndex = cart.findIndex((cartItem) => cartItem.inventory_id === item.id)

    if (existingIndex >= 0) {
      const updatedCart = [...cart]
      updatedCart[existingIndex].quantity += 1
      setCart(updatedCart)
    } else {
      setCart([
        ...cart,
        {
          id: Math.random().toString(),
          inventory_id: item.id,
          name: item.name,
          sku: item.sku,
          price: item.price,
          quantity: 1,
          tax_rate: item.tax_rate || 8.75,
          category: item.category || "general",
        },
      ])
    }
  }

  // Update item quantity
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index)
      return
    }

    const updatedCart = [...cart]
    updatedCart[index].quantity = quantity
    setCart(updatedCart)
  }

  // Remove item from cart
  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index)
    setCart(updatedCart)
  }

  // Apply discount code
  const applyDiscountCode = async () => {
    try {
      const result = await advancedPOSService.applyDiscount(cart, discountCode)
      toast({
        title: "Discount Applied",
        description: `Discount of $${result.discount.toFixed(2)} applied`,
      })
    } catch (error) {
      toast({
        title: "Invalid Discount Code",
        description: "The discount code is invalid or expired",
        variant: "destructive",
      })
    }
  }

  // Process transaction
  const processTransaction = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)

      const transaction = {
        customer_id: customer?.id,
        items: cart,
        subtotal,
        discount_amount: totalDiscount,
        tax_amount: totalTax,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        loyalty_points_used: loyaltyPointsToUse,
        store_credit_used: creditDiscount,
      }

      let result
      if (showSplitPayment && splitPayments.length > 0) {
        result = await advancedPOSService.processSplitPayment(transaction, splitPayments)
      } else {
        // Regular transaction processing
        result = { success: true, transaction }
      }

      if (result.success) {
        // Update customer loyalty points
        if (customer) {
          const earnedPoints = await advancedPOSService.calculateLoyaltyPoints(finalTotal, customer.id)
          toast({
            title: "Transaction Complete",
            description: `Customer earned ${earnedPoints} loyalty points`,
          })
        }

        // Clear cart and reset
        setCart([])
        setCustomer(null)
        setDiscountCode("")
        setManualDiscount(0)
        setLoyaltyPointsToUse(0)
        setStoreCreditToUse(0)
        setSplitPayments([])

        toast({
          title: "Transaction Successful",
          description: `Total: $${finalTotal.toFixed(2)}`,
        })
      }
    } catch (error) {
      console.error("Transaction error:", error)
      toast({
        title: "Transaction Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Create layaway
  const createLayaway = async (layawayData: any) => {
    try {
      const result = await advancedPOSService.createLayaway({
        customer_id: customer!.id,
        total_amount: finalTotal,
        deposit_amount: layawayData.deposit,
        due_date: layawayData.dueDate,
        payment_method: layawayData.paymentMethod,
        items: cart,
      })

      if (result.success) {
        toast({
          title: "Layaway Created",
          description: `Layaway #${result.layaway.id} created successfully`,
        })
        setCart([])
        setShowLayaway(false)
      }
    } catch (error) {
      toast({
        title: "Layaway Failed",
        description: "Could not create layaway",
        variant: "destructive",
      })
    }
  }

  // Create gift card
  const createGiftCard = async (amount: number) => {
    try {
      const result = await advancedPOSService.createGiftCard({
        amount,
        customer_id: customer?.id,
      })

      if (result.success) {
        toast({
          title: "Gift Card Created",
          description: `Gift card ${result.giftCard.card_number} created`,
        })
        setShowGiftCard(false)
      }
    } catch (error) {
      toast({
        title: "Gift Card Failed",
        description: "Could not create gift card",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Product Selection */}
      <div className="w-1/2 p-4 overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Products</CardTitle>
            <Button onClick={() => setShowBarcodeScanner(true)} size="sm">
              <Scan className="h-4 w-4 mr-2" />
              Scan
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search products..." className="pl-10" />
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Sample products - replace with actual data */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Product {i}</h3>
                    <p className="text-sm text-gray-500">SKU-{i}</p>
                    <p className="text-lg font-bold">${(i * 10).toFixed(2)}</p>
                    <Button
                      className="w-full mt-2"
                      size="sm"
                      onClick={() =>
                        addToCart({
                          id: `product-${i}`,
                          name: `Product ${i}`,
                          sku: `SKU-${i}`,
                          price: i * 10,
                          category: "general",
                          tax_rate: 8.75,
                        })
                      }
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Cart and Checkout */}
      <div className="w-1/2 p-4 flex flex-col">
        <Tabs defaultValue="cart" className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cart">Cart</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Shopping Cart
                  <Badge variant="secondary">{cart.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.sku}</p>
                          <p className="text-sm font-medium">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" onClick={() => removeFromCart(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cart Totals */}
                {cart.length > 0 && (
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-${totalDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {loyaltyDiscount > 0 && (
                      <div className="flex justify-between text-blue-600">
                        <span>Loyalty Points:</span>
                        <span>-${loyaltyDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {creditDiscount > 0 && (
                      <div className="flex justify-between text-purple-600">
                        <span>Store Credit:</span>
                        <span>-${creditDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("cash")}
                    className="h-16"
                  >
                    <DollarSign className="h-6 w-6 mr-2" />
                    Cash
                  </Button>
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="h-16"
                  >
                    <CreditCard className="h-6 w-6 mr-2" />
                    Card
                  </Button>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => setShowSplitPayment(true)}>
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Split Payment
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowLayaway(true)}
                    disabled={!customer}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Create Layaway
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => setShowGiftCard(true)}>
                    <Gift className="h-4 w-4 mr-2" />
                    Gift Card
                  </Button>
                </div>

                <Button
                  className="w-full h-16 text-lg"
                  onClick={processTransaction}
                  disabled={cart.length === 0 || isProcessing}
                >
                  {isProcessing ? "Processing..." : `Complete Sale - $${finalTotal.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          {customer.loyalty_points} points
                        </Badge>
                        <Badge variant="outline">${customer.store_credit.toFixed(2)} credit</Badge>
                      </div>
                    </div>

                    {customer.loyalty_points > 0 && (
                      <div className="space-y-2">
                        <Label>Use Loyalty Points (1 point = $0.01)</Label>
                        <Input
                          type="number"
                          max={customer.loyalty_points}
                          value={loyaltyPointsToUse}
                          onChange={(e) => setLoyaltyPointsToUse(Number(e.target.value))}
                        />
                      </div>
                    )}

                    {customer.store_credit > 0 && (
                      <div className="space-y-2">
                        <Label>Use Store Credit</Label>
                        <Input
                          type="number"
                          max={customer.store_credit}
                          value={storeCreditToUse}
                          onChange={(e) => setStoreCreditToUse(Number(e.target.value))}
                        />
                      </div>
                    )}

                    <Button variant="outline" className="w-full" onClick={() => setCustomer(null)}>
                      Remove Customer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input placeholder="Search customer by name, email, or phone" />
                    <Button className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Search Customer
                    </Button>
                    <Button variant="outline" className="w-full">
                      Continue as Guest
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="options">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Discount Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <Button onClick={applyDiscountCode}>Apply</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Manual Discount (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={manualDiscount}
                    onChange={(e) => setManualDiscount(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Receipt Template</Label>
                  <Select value={receiptTemplate} onValueChange={setReceiptTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    SMS
                  </Button>
                  <Button variant="outline" size="sm">
                    <Receipt className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <BarcodeScannerModal
        open={showBarcodeScanner}
        onOpenChange={setShowBarcodeScanner}
        onDetected={(barcode) => {
          // Handle barcode scan
          console.log("Scanned:", barcode)
        }}
      />

      {/* Split Payment Modal */}
      <Dialog open={showSplitPayment} onOpenChange={setShowSplitPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Split Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Total Amount: ${finalTotal.toFixed(2)}</p>
            {/* Split payment form */}
            <Button onClick={() => setShowSplitPayment(false)}>Apply Split Payment</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Layaway Modal */}
      <Dialog open={showLayaway} onOpenChange={setShowLayaway}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Layaway</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Deposit Amount</Label>
              <Input type="number" placeholder="Minimum deposit required" />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" />
            </div>
            <Button onClick={() => setShowLayaway(false)}>Create Layaway</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gift Card Modal */}
      <Dialog open={showGiftCard} onOpenChange={setShowGiftCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Gift Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Gift Card Amount</Label>
              <Input type="number" placeholder="Enter amount" />
            </div>
            <Button onClick={() => setShowGiftCard(false)}>Create Gift Card</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { getClientSupabaseClient } from "@/lib/supabase-client"
import { ShoppingCart, CreditCard, Package, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  sku?: string
  category: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export default function POSSystemComplete() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "split">("card")
  const [cashAmount, setCashAmount] = useState("")
  const [cardAmount, setCardAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [inventory, setInventory] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const { profile } = useAuth()
  const { toast } = useToast()
  const supabase = getClientSupabaseClient()

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("business_id", profile?.business_id)
        .gt("stock_quantity", 0)

      if (error) throw error
      setInventory(data || [])
    } catch (error) {
      console.error("Error loading inventory:", error)
    }
  }

  const addToCart = (item: CartItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateTotal() * 0.08 // 8% tax rate
  }

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax()
  }

  const processTransaction = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Create transaction record
      const transactionData = {
        business_id: profile?.business_id,
        customer_id: customer?.id,
        items: cart,
        subtotal: calculateTotal(),
        tax_amount: calculateTax(),
        total_amount: calculateGrandTotal(),
        payment_method: paymentMethod,
        cash_amount: paymentMethod === "cash" || paymentMethod === "split" ? Number.parseFloat(cashAmount) : null,
        card_amount: paymentMethod === "card" || paymentMethod === "split" ? Number.parseFloat(cardAmount) : null,
        processed_by: profile?.id,
        status: "completed",
      }

      const { data: transaction, error: transactionError } = await supabase
        .from("pos_transactions")
        .insert(transactionData)
        .select()
        .single()

      if (transactionError) throw transactionError

      // Update inventory quantities
      for (const item of cart) {
        const { error: inventoryError } = await supabase
          .from("inventory_items")
          .update({
            stock_quantity: supabase.raw(`stock_quantity - ${item.quantity}`),
          })
          .eq("id", item.id)

        if (inventoryError) throw inventoryError
      }

      toast({
        title: "Transaction Completed",
        description: `Sale processed successfully. Total: $${calculateGrandTotal().toFixed(2)}`,
      })

      // Reset cart and reload inventory
      setCart([])
      setCustomer(null)
      setCashAmount("")
      setCardAmount("")
      loadInventory()
    } catch (error) {
      console.error("Transaction error:", error)
      toast({
        title: "Transaction Failed",
        description: "There was an error processing the transaction",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Product Search & Inventory */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {filteredInventory.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3" onClick={() => addToCart(item)}>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.sku}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-green-600">${item.price}</span>
                      <Badge variant="secondary">{item.stock_quantity} left</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart & Checkout */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cart ({cart.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">${item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length === 0 && <p className="text-center text-gray-500 py-8">Cart is empty</p>}
          </CardContent>
        </Card>

        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customer ? (
              <div className="space-y-2">
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
                <Button size="sm" variant="outline" onClick={() => setCustomer(null)}>
                  Remove Customer
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full">
                Select Customer
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Payment & Checkout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                >
                  Cash
                </Button>
                <Button
                  size="sm"
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                >
                  Card
                </Button>
                <Button
                  size="sm"
                  variant={paymentMethod === "split" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("split")}
                >
                  Split
                </Button>
              </div>

              {(paymentMethod === "cash" || paymentMethod === "split") && (
                <Input
                  placeholder="Cash amount"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  type="number"
                />
              )}

              {(paymentMethod === "card" || paymentMethod === "split") && (
                <Input
                  placeholder="Card amount"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  type="number"
                />
              )}
            </div>

            <Button className="w-full" onClick={processTransaction} disabled={isProcessing || cart.length === 0}>
              {isProcessing ? "Processing..." : "Complete Sale"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

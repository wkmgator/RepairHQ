"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scrollbar"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  X,
  Plus,
  Minus,
  Trash2,
  UserPlus,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Users,
  PackageSearch,
} from "lucide-react"
import { searchInventoryItems, searchCustomers, processPOSTransaction } from "@/app/pos/actions"
import type { InventoryItem, Customer, StoreSettings, PosRegister, PosCashDrawer, User } from "@/lib/supabase-types"
import { formatCurrency } from "@/lib/utils" // Or from "@/lib/pos-utils" or "@/lib/inventory-utils"
import { TAX_RATES, PAYMENT_METHODS } from "@/lib/pos-utils" // Assuming these constants are defined
import NewCustomerModal from "@/components/new-customer-modal" // You'll need to create this

interface POSSystemProps {
  settings: StoreSettings
  register: PosRegister
  cashDrawer: PosCashDrawer
  user: User // Authenticated user
}

interface CartItem extends InventoryItem {
  cartQuantity: number
}

export default function POSSystem({ settings, register, cashDrawer, user }: POSSystemProps) {
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false)
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS.CARD)
  const [cashReceived, setCashReceived] = useState<number | undefined>()
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)

  const taxRate = settings.tax_rate ?? TAX_RATES.DEFAULT

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.selling_price || 0) * item.cartQuantity, 0)
  }, [cart])

  const taxAmount = useMemo(() => {
    return subtotal * taxRate
  }, [subtotal, taxRate])

  const totalAmount = useMemo(() => {
    return subtotal + taxAmount
  }, [subtotal, taxRate])

  const changeAmount = useMemo(() => {
    if (paymentMethod === PAYMENT_METHODS.CASH && cashReceived && cashReceived >= totalAmount) {
      return cashReceived - totalAmount
    }
    return 0
  }, [paymentMethod, cashReceived, totalAmount])

  const handleSearch = useCallback(async () => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    const { data, error } = await searchInventoryItems(searchTerm)
    if (error) {
      toast({ title: "Search Error", description: "Could not fetch inventory items.", variant: "destructive" })
    } else {
      setSearchResults(data || [])
    }
    setIsSearching(false)
  }, [searchTerm, toast])

  const handleCustomerSearch = useCallback(async () => {
    if (customerSearchTerm.trim().length < 2) {
      setCustomerSearchResults([])
      return
    }
    setIsSearchingCustomer(true)
    const { data, error } = await searchCustomers(customerSearchTerm)
    if (error) {
      toast({ title: "Search Error", description: "Could not fetch customers.", variant: "destructive" })
    } else {
      setCustomerSearchResults(data || [])
    }
    setIsSearchingCustomer(false)
  }, [customerSearchTerm, toast])

  const addToCart = (item: InventoryItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        if (existingItem.cartQuantity < (existingItem.quantity_in_stock || 0)) {
          return prevCart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, cartQuantity: cartItem.cartQuantity + 1 } : cartItem,
          )
        } else {
          toast({ title: "Stock Limit", description: `Max stock for ${item.name} reached.`, variant: "default" })
          return prevCart
        }
      } else {
        if ((item.quantity_in_stock || 0) > 0) {
          return [...prevCart, { ...item, cartQuantity: 1 }]
        } else {
          toast({ title: "Out of Stock", description: `${item.name} is out of stock.`, variant: "default" })
          return prevCart
        }
      }
    })
    setSearchTerm("") // Clear search after adding
    setSearchResults([])
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) => {
            if (item.id === itemId) {
              const clampedQuantity = Math.max(0, Math.min(newQuantity, item.quantity_in_stock || 0))
              if (clampedQuantity === 0) return null // Will be filtered out
              return { ...item, cartQuantity: clampedQuantity }
            }
            return item
          })
          .filter(Boolean) as CartItem[], // Filter out nulls (items with 0 quantity)
    )
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setCustomerSearchTerm("")
    setCustomerSearchResults([])
  }

  const handleProcessPayment = async () => {
    if (cart.length === 0) {
      toast({ title: "Empty Cart", description: "Please add items to the cart.", variant: "default" })
      return
    }
    if (paymentMethod === PAYMENT_METHODS.CASH && (!cashReceived || cashReceived < totalAmount)) {
      toast({ title: "Insufficient Cash", description: "Cash received is less than total amount.", variant: "default" })
      return
    }

    setIsProcessingPayment(true)
    const transactionData = {
      customer_id: selectedCustomer?.id,
      employee_id: user.id, // Assuming user object has id
      store_id: register.store_id, // Assuming register object has store_id
      register_id: register.id,
      cash_drawer_id: cashDrawer.id,
      subtotal: subtotal,
      discount_amount: 0, // Implement discount logic later
      tax_amount: taxAmount,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      cash_received: paymentMethod === PAYMENT_METHODS.CASH ? cashReceived : undefined,
      change_amount: changeAmount,
      status: "completed" as "completed" | "pending" | "refunded" | "voided", // Ensure type matches
      items: cart.map((item) => ({
        item_id: item.id!,
        name: item.name!,
        sku: item.sku!,
        quantity: item.cartQuantity,
        unit_price: item.selling_price || 0,
        total_price: (item.selling_price || 0) * item.cartQuantity,
        category: item.category as any, // Cast if necessary, or ensure type matches
      })),
    }

    const { data: result, error } = await processPOSTransaction(transactionData)

    if (error || !result) {
      toast({
        title: "Payment Failed",
        description: error?.message || "Could not process payment.",
        variant: "destructive",
      })
    } else {
      toast({ title: "Payment Successful", description: `Transaction ID: ${result.transaction_id}` })
      // TODO: Print receipt using result.receipt_data
      console.log("Receipt Data:", result.receipt_data)
      // Reset POS state
      setCart([])
      setSelectedCustomer(null)
      setCashReceived(undefined)
      setIsCheckoutDialogOpen(false)
    }
    setIsProcessingPayment(false)
  }

  const handleCustomerCreated = (newCustomer: Customer) => {
    setSelectedCustomer(newCustomer)
    setIsNewCustomerModalOpen(false)
    toast({ title: "Customer Added", description: `${newCustomer.first_name} ${newCustomer.last_name} selected.` })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 h-[calc(100vh-var(--header-height,80px))]">
      {/* Left Panel: Product Search & Cart */}
      <div className="lg:col-span-2 flex flex-col gap-4 h-full">
        {/* Product Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageSearch className="h-5 w-5" /> Product Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Scan barcode or type item name/SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-grow"
              />
              <Button onClick={handleSearch} disabled={isSearching || searchTerm.trim().length < 2}>
                <Search className="h-4 w-4 mr-2" /> {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
            {searchResults.length > 0 && (
              <ScrollArea className="mt-4 h-40 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.selling_price || 0)}</TableCell>
                        <TableCell className="text-right">{item.quantity_in_stock}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => addToCart(item)}
                            disabled={(item.quantity_in_stock || 0) <= 0}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Cart */}
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Current Sale
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <ShoppingCart className="h-16 w-16 mb-4" />
                <p>Cart is empty. Add products to get started.</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center w-32">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id!, item.cartQuantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.cartQuantity}
                              onChange={(e) => updateQuantity(item.id!, Number.parseInt(e.target.value))}
                              className="h-8 w-12 text-center hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              min="0"
                              max={item.quantity_in_stock}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.id!, item.cartQuantity + 1)}
                              disabled={item.cartQuantity >= (item.quantity_in_stock || 0)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(item.selling_price || 0)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency((item.selling_price || 0) * item.cartQuantity)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id!)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Panel: Customer & Checkout */}
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/50">
                <div>
                  <p className="font-medium">
                    {selectedCustomer.first_name} {selectedCustomer.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email || selectedCustomer.phone}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedCustomer(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Search customer name, email, phone..."
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCustomerSearch()}
                    className="flex-grow"
                  />
                  <Button
                    onClick={handleCustomerSearch}
                    disabled={isSearchingCustomer || customerSearchTerm.trim().length < 2}
                  >
                    <Search className="h-4 w-4 mr-2" /> {isSearchingCustomer ? "..." : "Find"}
                  </Button>
                </div>
                {customerSearchResults.length > 0 && (
                  <ScrollArea className="h-32 border rounded-md mb-2">
                    <Table>
                      <TableBody>
                        {customerSearchResults.map((cust) => (
                          <TableRow key={cust.id} onClick={() => selectCustomer(cust)} className="cursor-pointer">
                            <TableCell>
                              {cust.first_name} {cust.last_name}
                              <br />
                              <span className="text-xs text-muted-foreground">{cust.email || cust.phone}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
                <Button variant="outline" className="w-full" onClick={() => setIsNewCustomerModalOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" /> Add New Customer
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Checkout Summary & Payment */}
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> Checkout
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({(taxRate * 100).toFixed(2)}%):</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            {/* Discount logic can be added here */}
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full text-lg py-6"
              onClick={() => setIsCheckoutDialogOpen(true)}
              disabled={cart.length === 0 || isProcessingPayment}
            >
              <CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* New Customer Modal */}
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onCustomerCreated={handleCustomerCreated}
      />

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Total amount due: <span className="font-bold">{formatCurrency(totalAmount)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PAYMENT_METHODS.CARD}>Card</SelectItem>
                  <SelectItem value={PAYMENT_METHODS.CASH}>Cash</SelectItem>
                  <SelectItem value={PAYMENT_METHODS.DIGITAL}>Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentMethod === PAYMENT_METHODS.CASH && (
              <div>
                <label htmlFor="cashReceived" className="block text-sm font-medium text-gray-700 mb-1">
                  Cash Received
                </label>
                <Input
                  id="cashReceived"
                  type="number"
                  value={cashReceived === undefined ? "" : cashReceived}
                  onChange={(e) => setCashReceived(Number.parseFloat(e.target.value) || undefined)}
                  placeholder="0.00"
                />
                {cashReceived && cashReceived >= totalAmount && (
                  <p className="text-sm text-green-600 mt-1">Change due: {formatCurrency(changeAmount)}</p>
                )}
                {cashReceived && cashReceived < totalAmount && (
                  <p className="text-sm text-red-600 mt-1">Amount is less than total.</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutDialogOpen(false)} disabled={isProcessingPayment}>
              Cancel
            </Button>
            <Button
              onClick={handleProcessPayment}
              disabled={
                isProcessingPayment ||
                (paymentMethod === PAYMENT_METHODS.CASH && (!cashReceived || cashReceived < totalAmount))
              }
            >
              {isProcessingPayment ? "Processing..." : `Pay ${formatCurrency(totalAmount)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

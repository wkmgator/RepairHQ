"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trash2, PlusCircle, CreditCardIcon, Edit, ShieldCheck, BanknoteIcon as Bank } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { JSX } from "react"

interface PaymentMethod {
  id: string
  type: "card" | "bank_account" | "paypal"
  isDefault: boolean
  lastUsed?: string
  details: {
    last4?: string
    brand?: string
    expMonth?: number
    expYear?: number
    bankName?: string
    accountType?: string
    email?: string
  }
}

interface BillingAddress {
  id: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function PaymentMethodManagement() {
  const [loading, setLoading] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [billingAddresses, setBillingAddresses] = useState<BillingAddress[]>([])
  const [activeTab, setActiveTab] = useState("payment-methods")
  const [showAddCard, setShowAddCard] = useState(false)
  const [showAddBank, setShowAddBank] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)

  // New card form state
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    isDefault: false,
    billingAddressId: "",
  })

  // New bank account form state
  const [newBank, setNewBank] = useState({
    accountNumber: "",
    routingNumber: "",
    accountType: "checking",
    accountHolderName: "",
    isDefault: false,
    billingAddressId: "",
  })

  // New billing address form state
  const [newAddress, setNewAddress] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    isDefault: false,
  })

  useEffect(() => {
    fetchPaymentData()
  }, [])

  const fetchPaymentData = async () => {
    setLoading(true)
    try {
      // In a real app, these would be actual Supabase queries
      // Fetch payment methods
      const { data: paymentMethodsData } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", "current-user-id")
        .order("is_default", { ascending: false })

      // Fetch billing addresses
      const { data: addressesData } = await supabase
        .from("billing_addresses")
        .select("*")
        .eq("user_id", "current-user-id")
        .order("is_default", { ascending: false })

      // Simulate data for demo
      setPaymentMethods([
        {
          id: "pm-1",
          type: "card",
          isDefault: true,
          lastUsed: "2023-11-15T14:23:45Z",
          details: {
            last4: "4242",
            brand: "visa",
            expMonth: 12,
            expYear: 2025,
          },
        },
        {
          id: "pm-2",
          type: "bank_account",
          isDefault: false,
          lastUsed: "2023-10-01T09:12:33Z",
          details: {
            last4: "6789",
            bankName: "Chase",
            accountType: "checking",
          },
        },
        {
          id: "pm-3",
          type: "paypal",
          isDefault: false,
          details: {
            email: "user@example.com",
          },
        },
      ])

      setBillingAddresses([
        {
          id: "addr-1",
          name: "John Doe",
          line1: "123 Main St",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "US",
          isDefault: true,
        },
        {
          id: "addr-2",
          name: "John Doe",
          line1: "456 Market St",
          line2: "Suite 200",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "US",
          isDefault: false,
        },
      ])
    } catch (error) {
      console.error("Error fetching payment data:", error)
    } finally {
      setLoading(false)
    }
  }

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    )
  }

  const deletePaymentMethod = (id: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))
    }
  }

  const setDefaultBillingAddress = (id: string) => {
    setBillingAddresses(
      billingAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

  const deleteBillingAddress = (id: string) => {
    if (confirm("Are you sure you want to delete this billing address?")) {
      setBillingAddresses(billingAddresses.filter((addr) => addr.id !== id))
    }
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would call Stripe or another payment processor
    const newPaymentMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: "card",
      isDefault: newCard.isDefault,
      details: {
        last4: newCard.number.slice(-4),
        brand: getCardBrand(newCard.number),
        expMonth: Number.parseInt(newCard.expMonth),
        expYear: Number.parseInt(newCard.expYear),
      },
    }

    if (newCard.isDefault) {
      setPaymentMethods(
        paymentMethods.map((pm) => ({
          ...pm,
          isDefault: false,
        })),
      )
    }

    setPaymentMethods([...paymentMethods, newPaymentMethod])
    setShowAddCard(false)
    setNewCard({
      number: "",
      name: "",
      expMonth: "",
      expYear: "",
      cvc: "",
      isDefault: false,
      billingAddressId: "",
    })
  }

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would call a payment processor API
    const newPaymentMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: "bank_account",
      isDefault: newBank.isDefault,
      details: {
        last4: newBank.accountNumber.slice(-4),
        bankName: "Bank", // In a real app, this would be determined by the routing number
        accountType: newBank.accountType,
      },
    }

    if (newBank.isDefault) {
      setPaymentMethods(
        paymentMethods.map((pm) => ({
          ...pm,
          isDefault: false,
        })),
      )
    }

    setPaymentMethods([...paymentMethods, newPaymentMethod])
    setShowAddBank(false)
    setNewBank({
      accountNumber: "",
      routingNumber: "",
      accountType: "checking",
      accountHolderName: "",
      isDefault: false,
      billingAddressId: "",
    })
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()

    const newBillingAddress: BillingAddress = {
      id: `addr-${Date.now()}`,
      name: newAddress.name,
      line1: newAddress.line1,
      line2: newAddress.line2,
      city: newAddress.city,
      state: newAddress.state,
      postalCode: newAddress.postalCode,
      country: newAddress.country,
      isDefault: newAddress.isDefault,
    }

    if (newAddress.isDefault) {
      setBillingAddresses(
        billingAddresses.map((addr) => ({
          ...addr,
          isDefault: false,
        })),
      )
    }

    setBillingAddresses([...billingAddresses, newBillingAddress])
    setShowAddAddress(false)
    setNewAddress({
      name: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      isDefault: false,
    })
  }

  const getCardBrand = (cardNumber: string): string => {
    // Very simplified card brand detection
    if (cardNumber.startsWith("4")) return "visa"
    if (cardNumber.startsWith("5")) return "mastercard"
    if (cardNumber.startsWith("3")) return "amex"
    if (cardNumber.startsWith("6")) return "discover"
    return "unknown"
  }

  const formatCardNumber = (value: string): string => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
  }

  const getCardBrandIcon = (brand: string): JSX.Element => {
    switch (brand.toLowerCase()) {
      case "visa":
        return <span className="font-bold text-blue-600">Visa</span>
      case "mastercard":
        return <span className="font-bold text-red-600">Mastercard</span>
      case "amex":
        return <span className="font-bold text-blue-500">Amex</span>
      case "discover":
        return <span className="font-bold text-orange-600">Discover</span>
      default:
        return <CreditCardIcon className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <p className="text-gray-600">Manage your payment methods and billing addresses</p>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing-addresses">Billing Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={method.isDefault ? "border-blue-200" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {method.type === "card" && (
                        <>
                          {getCardBrandIcon(method.details.brand || "unknown")}
                          <CardTitle className="text-lg">•••• {method.details.last4}</CardTitle>
                        </>
                      )}
                      {method.type === "bank_account" && (
                        <>
                          <Bank className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">
                            {method.details.bankName} •••• {method.details.last4}
                          </CardTitle>
                        </>
                      )}
                      {method.type === "paypal" && (
                        <>
                          <span className="font-bold text-blue-700">PayPal</span>
                          <CardTitle className="text-lg">{method.details.email}</CardTitle>
                        </>
                      )}
                    </div>
                    {method.isDefault && (
                      <Badge variant="outline" className="bg-blue-50">
                        Default
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {method.type === "card" && (
                      <>
                        Expires {method.details.expMonth}/{method.details.expYear}
                      </>
                    )}
                    {method.type === "bank_account" && <>{method.details.accountType} Account</>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {method.lastUsed && (
                    <div className="text-sm text-gray-500">
                      Last used: {new Date(method.lastUsed).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => setDefaultPaymentMethod(method.id)}>
                      Set as Default
                    </Button>
                  )}
                  {method.isDefault && <div className="text-sm text-gray-500">Default payment method</div>}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePaymentMethod(method.id)}
                    disabled={method.isDefault}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Add New Card Button */}
            <Card
              className="border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowAddCard(true)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900">Add Credit Card</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Add a new credit or debit card</p>
              </CardContent>
            </Card>

            {/* Add New Bank Account Button */}
            <Card
              className="border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowAddBank(true)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Bank className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900">Add Bank Account</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Connect your bank account for ACH payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Credit Card Form */}
          {showAddCard && (
            <Card>
              <CardHeader>
                <CardTitle>Add Credit Card</CardTitle>
                <CardDescription>Enter your card details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCard} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        value={newCard.number}
                        onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <Input
                        id="card-name"
                        value={newCard.name}
                        onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="exp-month">Expiry Month</Label>
                        <Select
                          value={newCard.expMonth}
                          onValueChange={(value) => setNewCard({ ...newCard, expMonth: value })}
                        >
                          <SelectTrigger id="exp-month">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                              <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                                {month.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="exp-year">Expiry Year</Label>
                        <Select
                          value={newCard.expYear}
                          onValueChange={(value) => setNewCard({ ...newCard, expYear: value })}
                        >
                          <SelectTrigger id="exp-year">
                            <SelectValue placeholder="YY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          value={newCard.cvc}
                          onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="billing-address">Billing Address</Label>
                      <Select
                        value={newCard.billingAddressId}
                        onValueChange={(value) => setNewCard({ ...newCard, billingAddressId: value })}
                      >
                        <SelectTrigger id="billing-address">
                          <SelectValue placeholder="Select billing address" />
                        </SelectTrigger>
                        <SelectContent>
                          {billingAddresses.map((address) => (
                            <SelectItem key={address.id} value={address.id}>
                              {address.name} - {address.line1}, {address.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="default-card"
                        checked={newCard.isDefault}
                        onCheckedChange={(checked) => setNewCard({ ...newCard, isDefault: checked })}
                      />
                      <Label htmlFor="default-card">Set as default payment method</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => setShowAddCard(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Card</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Add Bank Account Form */}
          {showAddBank && (
            <Card>
              <CardHeader>
                <CardTitle>Add Bank Account</CardTitle>
                <CardDescription>Connect your bank account for ACH payments</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBank} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="account-holder">Account Holder Name</Label>
                      <Input
                        id="account-holder"
                        value={newBank.accountHolderName}
                        onChange={(e) => setNewBank({ ...newBank, accountHolderName: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="routing-number">Routing Number</Label>
                      <Input
                        id="routing-number"
                        value={newBank.routingNumber}
                        onChange={(e) => setNewBank({ ...newBank, routingNumber: e.target.value })}
                        placeholder="123456789"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input
                        id="account-number"
                        value={newBank.accountNumber}
                        onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                        placeholder="123456789012"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="account-type">Account Type</Label>
                      <RadioGroup
                        value={newBank.accountType}
                        onValueChange={(value) => setNewBank({ ...newBank, accountType: value })}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="checking" id="checking" />
                          <Label htmlFor="checking">Checking</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="savings" id="savings" />
                          <Label htmlFor="savings">Savings</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="bank-billing-address">Billing Address</Label>
                      <Select
                        value={newBank.billingAddressId}
                        onValueChange={(value) => setNewBank({ ...newBank, billingAddressId: value })}
                      >
                        <SelectTrigger id="bank-billing-address">
                          <SelectValue placeholder="Select billing address" />
                        </SelectTrigger>
                        <SelectContent>
                          {billingAddresses.map((address) => (
                            <SelectItem key={address.id} value={address.id}>
                              {address.name} - {address.line1}, {address.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="default-bank"
                        checked={newBank.isDefault}
                        onCheckedChange={(checked) => setNewBank({ ...newBank, isDefault: checked })}
                      />
                      <Label htmlFor="default-bank">Set as default payment method</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => setShowAddBank(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Bank Account</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="billing-addresses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {billingAddresses.map((address) => (
              <Card key={address.id} className={address.isDefault ? "border-blue-200" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{address.name}</CardTitle>
                    {address.isDefault && (
                      <Badge variant="outline" className="bg-blue-50">
                        Default
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => setDefaultBillingAddress(address.id)}>
                      Set as Default
                    </Button>
                  )}
                  {address.isDefault && <div className="text-sm text-gray-500">Default billing address</div>}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBillingAddress(address.id)}
                      disabled={address.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}

            {/* Add New Address Button */}
            <Card
              className="border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowAddAddress(true)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900">Add Billing Address</h3>
                <p className="text-sm text-gray-500 text-center mt-1">Add a new billing address</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Billing Address Form */}
          {showAddAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Add Billing Address</CardTitle>
                <CardDescription>Enter your billing address details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="address-name">Full Name</Label>
                      <Input
                        id="address-name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address-line1">Address Line 1</Label>
                      <Input
                        id="address-line1"
                        value={newAddress.line1}
                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                        placeholder="123 Main St"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address-line2">Address Line 2 (Optional)</Label>
                      <Input
                        id="address-line2"
                        value={newAddress.line2}
                        onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="address-city">City</Label>
                        <Input
                          id="address-city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="San Francisco"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address-state">State / Province</Label>
                        <Input
                          id="address-state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="CA"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="address-postal">Postal Code</Label>
                        <Input
                          id="address-postal"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          placeholder="94105"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address-country">Country</Label>
                        <Select
                          value={newAddress.country}
                          onValueChange={(value) => setNewAddress({ ...newAddress, country: value })}
                        >
                          <SelectTrigger id="address-country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="MX">Mexico</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="default-address"
                        checked={newAddress.isDefault}
                        onCheckedChange={(checked) => setNewAddress({ ...newAddress, isDefault: checked })}
                      />
                      <Label htmlFor="default-address">Set as default billing address</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => setShowAddAddress(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Address</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Security Information */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 bg-white rounded-full">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Secure Payment Processing</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your payment information is encrypted and securely stored. We use industry-standard security measures to
                protect your data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

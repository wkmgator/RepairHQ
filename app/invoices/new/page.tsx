"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { collection, query, where, getDocs, addDoc, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { generateInvoiceNumber, calculateInvoiceTotals } from "@/lib/invoice-utils"
import type { Customer, Ticket, InvoiceItem } from "@/lib/firestore-types"

export default function NewInvoicePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerId: "",
    ticketId: "",
    dueDate: "",
    notes: "",
    taxRate: 8.5,
  })
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      itemId: "1",
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      type: "service" as const,
    },
  ])

  useEffect(() => {
    if (!user?.uid) return

    const fetchData = async () => {
      try {
        // Fetch customers
        const customersQuery = query(collection(db, "customers"), where("userId", "==", user.uid))
        const customersSnapshot = await getDocs(customersQuery)
        const customersData = customersSnapshot.docs.map((doc) => ({
          customerId: doc.id,
          ...doc.data(),
        })) as Customer[]
        setCustomers(customersData)

        // Fetch tickets
        const ticketsQuery = query(collection(db, "tickets"), where("userId", "==", user.uid))
        const ticketsSnapshot = await getDocs(ticketsQuery)
        const ticketsData = ticketsSnapshot.docs.map((doc) => ({
          ticketId: doc.id,
          ...doc.data(),
        })) as Ticket[]
        setTickets(ticketsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [user?.uid])

  const handleTicketSelect = async (ticketId: string) => {
    if (!ticketId) return

    try {
      const ticketDoc = await getDoc(doc(db, "tickets", ticketId))
      if (ticketDoc.exists()) {
        const ticket = ticketDoc.data() as Ticket

        // Auto-fill customer
        setFormData((prev) => ({
          ...prev,
          ticketId,
          customerId: ticket.customerId,
        }))

        // Auto-fill items from ticket
        const ticketItems: InvoiceItem[] = []

        if (ticket.laborCost > 0) {
          ticketItems.push({
            itemId: Date.now().toString(),
            description: `Repair Service - ${ticket.deviceType} ${ticket.deviceModel}`,
            quantity: 1,
            unitPrice: ticket.laborCost,
            totalPrice: ticket.laborCost,
            type: "labor",
          })
        }

        if (ticket.partsCost > 0) {
          ticketItems.push({
            itemId: (Date.now() + 1).toString(),
            description: `Parts - ${ticket.deviceType} ${ticket.deviceModel}`,
            quantity: 1,
            unitPrice: ticket.partsCost,
            totalPrice: ticket.partsCost,
            type: "part",
          })
        }

        if (ticketItems.length > 0) {
          setItems(ticketItems)
        }
      }
    } catch (error) {
      console.error("Error fetching ticket:", error)
    }
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      itemId: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      type: "service",
    }
    setItems([...items, newItem])
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.itemId !== itemId))
  }

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.itemId === itemId) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.uid || !formData.customerId) return

    setLoading(true)
    try {
      const totals = calculateInvoiceTotals(items, formData.taxRate)
      const invoiceNumber = generateInvoiceNumber()

      const invoiceData = {
        userId: user.uid,
        storeId: user.storeId || "default",
        customerId: formData.customerId,
        ticketId: formData.ticketId || null,
        invoiceNumber,
        status: "draft",
        items,
        subtotal: totals.subtotal,
        taxAmount: totals.tax,
        discountAmount: 0,
        totalAmount: totals.total,
        paidAmount: 0,
        balanceDue: totals.total,
        dueDate: new Date(formData.dueDate),
        notes: formData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const docRef = await addDoc(collection(db, "invoices"), invoiceData)
      router.push(`/invoices/${docRef.id}`)
    } catch (error) {
      console.error("Error creating invoice:", error)
    } finally {
      setLoading(false)
    }
  }

  const totals = calculateInvoiceTotals(items, formData.taxRate)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/invoices">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Invoice</h1>
          <p className="text-gray-600">Generate a new invoice for customer billing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer and Ticket Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Customer & Ticket</CardTitle>
              <CardDescription>Select the customer and optionally link to a repair ticket</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ticketId">Repair Ticket (Optional)</Label>
                <Select value={formData.ticketId} onValueChange={handleTicketSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a ticket to auto-fill" />
                  </SelectTrigger>
                  <SelectContent>
                    {tickets.map((ticket) => {
                      const customer = customers.find((c) => c.customerId === ticket.customerId)
                      return (
                        <SelectItem key={ticket.ticketId} value={ticket.ticketId}>
                          {ticket.ticketNumber} - {customer ? `${customer.firstName} ${customer.lastName}` : "Unknown"}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="customerId">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.customerId} value={customer.customerId}>
                        {customer.firstName} {customer.lastName} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={formData.taxRate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
              <CardDescription>Review the invoice totals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({formData.taxRate}%):</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes for the invoice..."
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Invoice Items</CardTitle>
                <CardDescription>Add services, parts, and other billable items</CardDescription>
              </div>
              <Button type="button" onClick={addItem} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.itemId} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Service or item description"
                      value={item.description}
                      onChange={(e) => updateItem(item.itemId, "description", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={item.type} onValueChange={(value) => updateItem(item.itemId, "type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="part">Part</SelectItem>
                        <SelectItem value="labor">Labor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.itemId, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.itemId, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label>Total</Label>
                      <Input value={`$${item.totalPrice.toFixed(2)}`} disabled />
                    </div>
                    {items.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.itemId)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/invoices">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  )
}

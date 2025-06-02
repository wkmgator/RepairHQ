"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { calculateInvoiceTotals } from "@/lib/invoice-utils"
import type { Invoice, InvoiceItem } from "@/lib/firestore-types"

interface EditInvoicePageProps {
  params: {
    id: string
  }
}

export default function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    dueDate: "",
    notes: "",
    taxRate: 8.5,
    status: "draft",
  })
  const [items, setItems] = useState<InvoiceItem[]>([])

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!user?.uid) return

      try {
        const invoiceDoc = await getDoc(doc(db, "invoices", params.id))
        if (invoiceDoc.exists()) {
          const invoiceData = {
            invoiceId: invoiceDoc.id,
            ...invoiceDoc.data(),
          } as Invoice

          setInvoice(invoiceData)
          setItems(invoiceData.items)
          setFormData({
            dueDate: new Date(invoiceData.dueDate.seconds * 1000).toISOString().split("T")[0],
            notes: invoiceData.notes || "",
            taxRate: (invoiceData.taxAmount / invoiceData.subtotal) * 100,
            status: invoiceData.status,
          })
        }
      } catch (error) {
        console.error("Error fetching invoice:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [user?.uid, params.id])

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
    if (!invoice) return

    setSaving(true)
    try {
      const totals = calculateInvoiceTotals(items, formData.taxRate)

      const updateData = {
        items,
        subtotal: totals.subtotal,
        taxAmount: totals.tax,
        totalAmount: totals.total,
        balanceDue: totals.total - invoice.paidAmount,
        dueDate: new Date(formData.dueDate),
        notes: formData.notes,
        status: formData.status,
        updatedAt: new Date(),
      }

      await updateDoc(doc(db, "invoices", invoice.invoiceId), updateData)
      router.push(`/invoices/${invoice.invoiceId}`)
    } catch (error) {
      console.error("Error updating invoice:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!invoice || !confirm("Are you sure you want to delete this invoice?")) return

    try {
      await deleteDoc(doc(db, "invoices", invoice.invoiceId))
      router.push("/invoices")
    } catch (error) {
      console.error("Error deleting invoice:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Invoice not found</h2>
          <p className="text-gray-600 mt-2">The invoice you're looking for doesn't exist.</p>
          <Link href="/invoices" className="mt-4 inline-block">
            <Button>Back to Invoices</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totals = calculateInvoiceTotals(items, formData.taxRate)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/invoices/${invoice.invoiceId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoice
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Invoice {invoice.invoiceNumber}</h1>
            <p className="text-gray-600">Update invoice details and items</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Invoice
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoice Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Update invoice status and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
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

          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
              <CardDescription>Review the updated totals</CardDescription>
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

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span className="text-green-600">${invoice.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Balance Due:</span>
                  <span className={totals.total - invoice.paidAmount > 0 ? "text-red-600" : "text-green-600"}>
                    ${(totals.total - invoice.paidAmount).toFixed(2)}
                  </span>
                </div>
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
                <CardDescription>Update services, parts, and other billable items</CardDescription>
              </div>
              <Button type="button" onClick={addItem} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
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
          <Link href={`/invoices/${invoice.invoiceId}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

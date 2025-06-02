"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Send, Download, CheckCircle, Printer } from "lucide-react"
import Link from "next/link"
import { formatCurrency, getStatusColor } from "@/lib/invoice-utils"
import type { Invoice, Customer, Ticket } from "@/lib/firestore-types"

interface InvoiceDetailPageProps {
  params: {
    id: string
  }
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { user } = useAuth()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!user?.uid) return

      try {
        // Fetch invoice
        const invoiceDoc = await getDoc(doc(db, "invoices", params.id))
        if (invoiceDoc.exists()) {
          const invoiceData = {
            invoiceId: invoiceDoc.id,
            ...invoiceDoc.data(),
          } as Invoice
          setInvoice(invoiceData)

          // Fetch customer
          const customerDoc = await getDoc(doc(db, "customers", invoiceData.customerId))
          if (customerDoc.exists()) {
            setCustomer({
              customerId: customerDoc.id,
              ...customerDoc.data(),
            } as Customer)
          }

          // Fetch ticket if linked
          if (invoiceData.ticketId) {
            const ticketDoc = await getDoc(doc(db, "tickets", invoiceData.ticketId))
            if (ticketDoc.exists()) {
              setTicket({
                ticketId: ticketDoc.id,
                ...ticketDoc.data(),
              } as Ticket)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoiceData()
  }, [user?.uid, params.id])

  const handleMarkAsPaid = async () => {
    if (!invoice) return

    try {
      await updateDoc(doc(db, "invoices", invoice.invoiceId), {
        status: "paid",
        paidDate: new Date(),
        paidAmount: invoice.totalAmount,
        balanceDue: 0,
        updatedAt: new Date(),
      })

      setInvoice((prev) =>
        prev
          ? {
              ...prev,
              status: "paid",
              paidDate: new Date(),
              paidAmount: prev.totalAmount,
              balanceDue: 0,
            }
          : null,
      )
    } catch (error) {
      console.error("Error marking invoice as paid:", error)
    }
  }

  const handleSendInvoice = async () => {
    if (!invoice) return

    try {
      await updateDoc(doc(db, "invoices", invoice.invoiceId), {
        status: "sent",
        updatedAt: new Date(),
      })

      setInvoice((prev) => (prev ? { ...prev, status: "sent" } : null))
    } catch (error) {
      console.error("Error sending invoice:", error)
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/invoices">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoices
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Invoice {invoice.invoiceNumber}</h1>
            <p className="text-gray-600">
              Created on {new Date(invoice.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(invoice.status)}>{invoice.status.replace("_", " ").toUpperCase()}</Badge>
          <div className="flex gap-2">
            {invoice.status === "draft" && (
              <Button onClick={handleSendInvoice}>
                <Send className="w-4 h-4 mr-2" />
                Send Invoice
              </Button>
            )}
            {(invoice.status === "sent" || invoice.status === "overdue") && (
              <Button onClick={handleMarkAsPaid}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Paid
              </Button>
            )}
            <Link href={`/invoices/${invoice.invoiceId}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Bill To</CardTitle>
            </CardHeader>
            <CardContent>
              {customer ? (
                <div className="space-y-2">
                  <p className="font-semibold">
                    {customer.firstName} {customer.lastName}
                  </p>
                  {customer.email && <p>{customer.email}</p>}
                  <p>{customer.phone}</p>
                  {customer.address && (
                    <div>
                      <p>{customer.address}</p>
                      <p>
                        {customer.city}, {customer.state} {customer.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p>Customer information not available</p>
              )}
            </CardContent>
          </Card>

          {/* Linked Ticket */}
          {ticket && (
            <Card>
              <CardHeader>
                <CardTitle>Linked Repair Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Ticket #:</span>
                    <Link href={`/tickets/${ticket.ticketId}`} className="text-blue-600 hover:underline ml-1">
                      {ticket.ticketNumber}
                    </Link>
                  </p>
                  <p>
                    <span className="font-medium">Device:</span> {ticket.deviceBrand} {ticket.deviceModel}
                  </p>
                  <p>
                    <span className="font-medium">Issue:</span> {ticket.issueDescription}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <Badge className={`ml-1 ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Description</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Unit Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.itemId} className="border-b">
                        <td className="py-3">{item.description}</td>
                        <td className="py-3">
                          <Badge variant="outline">{item.type.toUpperCase()}</Badge>
                        </td>
                        <td className="py-3 text-right">{item.quantity}</td>
                        <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>

              {invoice.notes && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Notes:</h4>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span className="font-medium text-green-600">{formatCurrency(invoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance Due:</span>
                  <span className={`font-medium ${invoice.balanceDue > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(invoice.balanceDue)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Due Date:</span>
                  <span>{new Date(invoice.dueDate.seconds * 1000).toLocaleDateString()}</span>
                </div>
                {invoice.paidDate && (
                  <div className="flex justify-between">
                    <span>Paid Date:</span>
                    <span>{new Date(invoice.paidDate.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                )}
                {invoice.paymentMethod && (
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">{invoice.paymentMethod.replace("_", " ")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {customer && (
                <Link href={`/customers/${customer.customerId}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    View Customer Profile
                  </Button>
                </Link>
              )}
              {ticket && (
                <Link href={`/tickets/${ticket.ticketId}`} className="block">
                  <Button variant="outline" className="w-full justify-start">
                    View Repair Ticket
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Send className="w-4 h-4 mr-2" />
                Email to Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

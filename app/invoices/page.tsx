"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Eye, Edit, Trash2, Send, DollarSign, FileText, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { formatCurrency, getStatusColor } from "@/lib/invoice-utils"
import type { Invoice, Customer, Ticket } from "@/lib/firestore-types"

export default function InvoicesPage() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!user?.uid) return

    const invoicesQuery = query(
      collection(db, "invoices"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    )

    const customersQuery = query(collection(db, "customers"), where("userId", "==", user.uid))

    const ticketsQuery = query(collection(db, "tickets"), where("userId", "==", user.uid))

    const unsubscribeInvoices = onSnapshot(invoicesQuery, (snapshot) => {
      const invoicesData = snapshot.docs.map((doc) => ({
        invoiceId: doc.id,
        ...doc.data(),
      })) as Invoice[]
      setInvoices(invoicesData)
      setLoading(false)
    })

    const unsubscribeCustomers = onSnapshot(customersQuery, (snapshot) => {
      const customersData = snapshot.docs.map((doc) => ({
        customerId: doc.id,
        ...doc.data(),
      })) as Customer[]
      setCustomers(customersData)
    })

    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      const ticketsData = snapshot.docs.map((doc) => ({
        ticketId: doc.id,
        ...doc.data(),
      })) as Ticket[]
      setTickets(ticketsData)
    })

    return () => {
      unsubscribeInvoices()
      unsubscribeCustomers()
      unsubscribeTickets()
    }
  }, [user?.uid])

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.customerId === customerId)
    return customer ? `${customer.firstName} ${customer.lastName}` : "Unknown Customer"
  }

  const getTicketNumber = (ticketId?: string) => {
    if (!ticketId) return "N/A"
    const ticket = tickets.find((t) => t.ticketId === ticketId)
    return ticket?.ticketNumber || "N/A"
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(invoice.customerId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTicketNumber(invoice.ticketId).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === "draft").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    totalRevenue: invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.totalAmount, 0),
    pendingRevenue: invoices
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((sum, i) => sum + i.balanceDue, 0),
  }

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      await updateDoc(doc(db, "invoices", invoiceId), {
        status: "paid",
        paidDate: new Date(),
        paidAmount: invoices.find((i) => i.invoiceId === invoiceId)?.totalAmount || 0,
        balanceDue: 0,
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error("Error marking invoice as paid:", error)
    }
  }

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      await updateDoc(doc(db, "invoices", invoiceId), {
        status: "sent",
        updatedAt: new Date(),
      })
    } catch (error) {
      console.error("Error sending invoice:", error)
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteDoc(doc(db, "invoices", invoiceId))
      } catch (error) {
        console.error("Error deleting invoice:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-gray-600">Manage billing and payment tracking</p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.draft} draft, {stats.sent} sent, {stats.paid} paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From {stats.paid} paid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingRevenue)}</div>
            <p className="text-xs text-muted-foreground">From {stats.sent + stats.overdue} unpaid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Invoices past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No invoices found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by creating your first invoice."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <div className="mt-6">
                  <Link href="/invoices/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Invoice #</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Ticket #</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.invoiceId} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link
                          href={`/invoices/${invoice.invoiceId}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{getCustomerName(invoice.customerId)}</td>
                      <td className="py-3 px-4">
                        {invoice.ticketId ? (
                          <Link href={`/tickets/${invoice.ticketId}`} className="text-blue-600 hover:underline">
                            {getTicketNumber(invoice.ticketId)}
                          </Link>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(invoice.totalAmount)}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{new Date(invoice.dueDate.seconds * 1000).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/invoices/${invoice.invoiceId}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/invoices/${invoice.invoiceId}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          {invoice.status === "draft" && (
                            <Button variant="ghost" size="sm" onClick={() => handleSendInvoice(invoice.invoiceId)}>
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          {(invoice.status === "sent" || invoice.status === "overdue") && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsPaid(invoice.invoiceId)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteInvoice(invoice.invoiceId)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, Wrench, DollarSign, Plus, FileText, Clock } from "lucide-react"
import Link from "next/link"
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Customer, Ticket, Invoice, Appointment } from "@/lib/firestore-types"
import { getCustomerById } from "../actions"

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const { customer: fetchedCustomer, error } = await getCustomerById(params.id)
  const router = useRouter()
  const { user } = useAuth()
  const [customer, setCustomer] = useState<Customer | null>(fetchedCustomer)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(!fetchedCustomer)

  useEffect(() => {
    if (user && params.id) {
      loadCustomerData()
    }
  }, [user, params.id])

  const loadCustomerData = async () => {
    if (!user || !params.id) return

    try {
      // Load customer
      const customerDoc = await getDoc(doc(db, "customers", params.id as string))
      if (customerDoc.exists()) {
        setCustomer({
          customerId: customerDoc.id,
          ...customerDoc.data(),
        } as Customer)
      }

      // Load tickets
      const ticketsRef = collection(db, "tickets")
      const ticketsQuery = query(ticketsRef, where("customerId", "==", params.id), orderBy("createdAt", "desc"))
      const ticketsSnapshot = await getDocs(ticketsQuery)
      const ticketsData = ticketsSnapshot.docs.map((doc) => ({
        ticketId: doc.id,
        ...doc.data(),
      })) as Ticket[]
      setTickets(ticketsData)

      // Load invoices
      const invoicesRef = collection(db, "invoices")
      const invoicesQuery = query(invoicesRef, where("customerId", "==", params.id), orderBy("createdAt", "desc"))
      const invoicesSnapshot = await getDocs(invoicesQuery)
      const invoicesData = invoicesSnapshot.docs.map((doc) => ({
        invoiceId: doc.id,
        ...doc.data(),
      })) as Invoice[]
      setInvoices(invoicesData)

      // Load appointments
      const appointmentsRef = collection(db, "appointments")
      const appointmentsQuery = query(
        appointmentsRef,
        where("customerId", "==", params.id),
        orderBy("startTime", "desc"),
      )
      const appointmentsSnapshot = await getDocs(appointmentsQuery)
      const appointmentsData = appointmentsSnapshot.docs.map((doc) => ({
        appointmentId: doc.id,
        ...doc.data(),
      })) as Appointment[]
      setAppointments(appointmentsData)
    } catch (error) {
      console.error("Error loading customer data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return "Not set"
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer not found</h2>
          <p className="text-gray-600 mb-4">The customer you're looking for doesn't exist.</p>
          <Link href="/customers">
            <Button>Back to Customers</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/customers">
                <Button variant="ghost" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {customer.first_name} {customer.last_name}
                </h1>
                <p className="text-gray-600">Customer ID: {customer.customerId.slice(-8)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href={`/customers/${customer.customerId}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Link href={`/tickets/new?customerId=${customer.customerId}`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Repair
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{customer.email}</span>
                </div>
              )}
              {(customer.address || customer.city) && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    {customer.address && <div>{customer.address}</div>}
                    {customer.city && customer.state && (
                      <div>
                        {customer.city}, {customer.state} {customer.zip_code}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Customer Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent:</span>
                <span className="font-semibold">{formatCurrency(customer.total_spent || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Repairs:</span>
                <span className="font-semibold">{customer.total_repairs || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loyalty Points:</span>
                <span className="font-semibold">{customer.loyalty_points || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Since:</span>
                <span className="font-semibold">{formatDate(customer.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/tickets/new?customerId=${customer.customerId}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Wrench className="h-4 w-4 mr-2" />
                  Create Repair Ticket
                </Button>
              </Link>
              <Link href={`/appointments/new?customerId=${customer.customerId}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </Link>
              <Link href={`/invoices/new?customerId=${customer.customerId}`}>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Customer Activity */}
        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets">Repair Tickets ({tickets.length})</TabsTrigger>
            <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
            <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Repair History</CardTitle>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No repair tickets yet</p>
                    <Link href={`/tickets/new?customerId=${customer.customerId}`}>
                      <Button className="mt-4">Create First Ticket</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.ticketId} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">#{ticket.ticketId.slice(-6)}</span>
                            <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
                          </div>
                          <div className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {ticket.deviceType} - {ticket.deviceBrand} {ticket.deviceModel}
                        </div>
                        <div className="text-sm text-gray-800 mb-2">{ticket.issueDescription}</div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Estimated: {formatCurrency(ticket.estimatedCost)}</span>
                          <Link href={`/tickets/${ticket.ticketId}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointment History</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No appointments scheduled</p>
                    <Link href={`/appointments/new?customerId=${customer.customerId}`}>
                      <Button className="mt-4">Schedule First Appointment</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.appointmentId} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{appointment.title}</span>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{formatDate(appointment.startTime)}</div>
                        {appointment.description && (
                          <div className="text-sm text-gray-800">{appointment.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No invoices created</p>
                    <Link href={`/invoices/new?customerId=${customer.customerId}`}>
                      <Button className="mt-4">Create First Invoice</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.invoiceId} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">#{invoice.invoiceNumber}</span>
                          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Created: {formatDate(invoice.createdAt)}</span>
                          <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Customer Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {customer.notes ? (
                  <div className="whitespace-pre-wrap text-gray-700">{customer.notes}</div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No notes available</p>
                    <Link href={`/customers/${customer.customerId}/edit`}>
                      <Button className="mt-4">Add Notes</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

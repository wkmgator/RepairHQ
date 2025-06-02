"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Wrench,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react"
import { format } from "date-fns"

interface CustomerTicket {
  id: string
  title: string
  description: string
  status: string
  priority: string
  device_info: any
  created_at: string
  updated_at: string
  estimated_completion?: string
  total_cost?: number
}

interface CustomerAppointment {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  status: string
  service_type: string
}

interface CustomerInvoice {
  id: string
  invoice_number: string
  total_amount: number
  status: string
  due_date: string
  created_at: string
  items: any[]
}

export default function CustomerPortalPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [customerInfo, setCustomerInfo] = useState<any>(null)
  const [tickets, setTickets] = useState<CustomerTicket[]>([])
  const [appointments, setAppointments] = useState<CustomerAppointment[]>([])
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchCustomerData()
  }, [])

  const fetchCustomerData = async () => {
    try {
      const supabase = getSupabaseClient()

      // In a real app, you'd get the customer ID from authentication
      const customerId = "customer-123" // This would come from auth context

      // Fetch customer info
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single()

      if (customerError && customerError.code !== "PGRST116") throw customerError

      // Fetch tickets
      const { data: ticketsData, error: ticketsError } = await supabase
        .from("tickets")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })

      if (ticketsError) throw ticketsError

      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("customer_id", customerId)
        .order("start_time", { ascending: false })

      if (appointmentsError) throw appointmentsError

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })

      if (invoicesError) throw invoicesError

      setCustomerInfo(customer)
      setTickets(ticketsData || [])
      setAppointments(appointmentsData || [])
      setInvoices(invoicesData || [])
    } catch (error) {
      console.error("Error fetching customer data:", error)
      toast({
        title: "Error",
        description: "Failed to load your information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0)
  }

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading your information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Customer Portal</h1>
              <p className="text-muted-foreground">Welcome back, {customerInfo?.first_name || "Customer"}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
              <Button>
                <Wrench className="mr-2 h-4 w-4" />
                New Repair Request
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Repairs</p>
                  <p className="text-2xl font-bold">{tickets.filter((t) => t.status !== "completed").length}</p>
                </div>
                <Wrench className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Appointments</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter((a) => new Date(a.start_time) > new Date()).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding Balance</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      invoices.filter((i) => i.status !== "paid").reduce((sum, i) => sum + i.total_amount, 0),
                    )}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Repairs</p>
                  <p className="text-2xl font-bold">{tickets.length}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="repairs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="repairs">My Repairs</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="repairs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Repair Tickets</CardTitle>
                    <CardDescription>Track the status of your device repairs</CardDescription>
                  </div>
                  <div className="w-64">
                    <Input
                      placeholder="Search repairs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No repairs found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "No repairs match your search" : "You haven't submitted any repair requests yet"}
                    </p>
                    <Button>
                      <Wrench className="mr-2 h-4 w-4" />
                      Request Repair
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <Card key={ticket.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getStatusIcon(ticket.status)}
                                <h3 className="font-medium">{ticket.title}</h3>
                                {getStatusBadge(ticket.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>Created: {format(new Date(ticket.created_at), "MMM d, yyyy")}</span>
                                {ticket.estimated_completion && (
                                  <span>
                                    Est. Completion: {format(new Date(ticket.estimated_completion), "MMM d, yyyy")}
                                  </span>
                                )}
                                {ticket.total_cost && <span>Cost: {formatCurrency(ticket.total_cost)}</span>}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>View and manage your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No appointments scheduled</h3>
                    <p className="text-muted-foreground mb-4">Book your first appointment to get started</p>
                    <Button>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{appointment.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{appointment.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span>{format(new Date(appointment.start_time), "MMM d, yyyy 'at' h:mm a")}</span>
                                <span>Service: {appointment.service_type}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(appointment.status)}
                              <Button variant="outline" size="sm">
                                Reschedule
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Invoices</CardTitle>
                <CardDescription>View and pay your invoices</CardDescription>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
                    <p className="text-muted-foreground">Your invoices will appear here once services are completed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <Card key={invoice.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Invoice #{invoice.invoice_number}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <span>Amount: {formatCurrency(invoice.total_amount)}</span>
                                <span>Due: {format(new Date(invoice.due_date), "MMM d, yyyy")}</span>
                                <span>Created: {format(new Date(invoice.created_at), "MMM d, yyyy")}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(invoice.status)}
                              {invoice.status !== "paid" && (
                                <Button size="sm">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Pay Now
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input value={customerInfo?.first_name || ""} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input value={customerInfo?.last_name || ""} readOnly />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={customerInfo?.email || ""} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input value={customerInfo?.phone || ""} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input value={customerInfo?.address || ""} readOnly />
                </div>
                <div className="pt-4">
                  <Button>Update Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

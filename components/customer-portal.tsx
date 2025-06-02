"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search } from "lucide-react"
import { CalendarIcon, Download, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

interface CustomerTicket {
  id: string
  ticket_number: string
  device_type: string
  issue_description: string
  status: string
  priority: string
  created_at: string
  estimated_completion: string
  technician_notes: string
  total_cost: number
}

interface CustomerInvoice {
  id: string
  invoice_number: string
  total_amount: number
  status: string
  created_at: string
  due_date: string
  paid_date?: string
}

interface CustomerAppointment {
  id: string
  appointment_date: string
  appointment_time: string
  service_type: string
  status: string
  notes: string
}

export function CustomerPortal() {
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<any>(null)
  const [tickets, setTickets] = useState<CustomerTicket[]>([])
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([])
  const [appointments, setAppointments] = useState<CustomerAppointment[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("repairs")
  const [newAppointment, setNewAppointment] = useState({
    date: new Date(),
    time: "",
    service_type: "",
    notes: "",
  })
  const [newReview, setNewReview] = useState({
    ticket_id: "",
    rating: 5,
    review_text: "",
  })

  useEffect(() => {
    // In a real app, this would get the customer ID from authentication
    const customerId = "customer-123"
    fetchCustomerData(customerId)
  }, [])

  const fetchCustomerData = async (customerId: string) => {
    setLoading(true)
    try {
      // Fetch customer profile
      const { data: customerData } = await supabase.from("customers").select("*").eq("id", customerId).single()

      // Fetch tickets
      const { data: ticketsData } = await supabase
        .from("tickets")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })

      // Fetch invoices
      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })

      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select("*")
        .eq("customer_id", customerId)
        .order("appointment_date", { ascending: true })

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from("customer_reviews")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })

      setCustomer(customerData)
      setTickets(ticketsData || [])
      setInvoices(invoicesData || [])
      setAppointments(appointmentsData || [])
      setReviews(reviewsData || [])
    } catch (error) {
      console.error("Error fetching customer data:", error)
    } finally {
      setLoading(false)
    }
  }

  const bookAppointment = async () => {
    try {
      const { data, error } = await supabase.from("appointments").insert({
        customer_id: customer.id,
        appointment_date: format(newAppointment.date, "yyyy-MM-dd"),
        appointment_time: newAppointment.time,
        service_type: newAppointment.service_type,
        status: "scheduled",
        notes: newAppointment.notes,
      })

      if (error) throw error

      alert("Appointment booked successfully!")
      setNewAppointment({ date: new Date(), time: "", service_type: "", notes: "" })
      fetchCustomerData(customer.id)
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Error booking appointment")
    }
  }

  const submitReview = async () => {
    try {
      const { data, error } = await supabase.from("customer_reviews").insert({
        customer_id: customer.id,
        ticket_id: newReview.ticket_id,
        rating: newReview.rating,
        review_text: newReview.review_text,
        is_public: true,
      })

      if (error) throw error

      alert("Review submitted successfully!")
      setNewReview({ ticket_id: "", rating: 5, review_text: "" })
      fetchCustomerData(customer.id)
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Error submitting review")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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
      <Card>
        <CardHeader>
          <CardTitle>Customer Portal</CardTitle>
          <CardDescription>Access customer self-service features</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="repairs" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="repairs">Repair Tracking</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>
            <TabsContent value="repairs" className="space-y-4">
              <div className="space-y-2">
                <Label>Ticket Number</Label>
                <Input placeholder="Enter your ticket number" />
              </div>
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Track Repair
              </Button>
            </TabsContent>
            <TabsContent value="invoices" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent Invoices */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                    <CardDescription>Your billing history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Invoice #</th>
                            <th className="text-left py-3 px-4 font-medium">Date</th>
                            <th className="text-left py-3 px-4 font-medium">Due Date</th>
                            <th className="text-left py-3 px-4 font-medium">Amount</th>
                            <th className="text-left py-3 px-4 font-medium">Status</th>
                            <th className="text-left py-3 px-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-mono">{invoice.invoice_number}</td>
                              <td className="py-3 px-4">{new Date(invoice.created_at).toLocaleDateString()}</td>
                              <td className="py-3 px-4">{new Date(invoice.due_date).toLocaleDateString()}</td>
                              <td className="py-3 px-4 font-bold">{formatCurrency(invoice.total_amount)}</td>
                              <td className="py-3 px-4">
                                <Badge className={getStatusColor(invoice.status)}>{invoice.status.toUpperCase()}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  {invoice.status === "pending" && <Button size="sm">Pay Now</Button>}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="appointments" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Book New Appointment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Book New Appointment</CardTitle>
                    <CardDescription>Schedule a service appointment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(newAppointment.date, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newAppointment.date}
                            onSelect={(date) => setNewAppointment({ ...newAppointment, date: date || new Date() })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Select
                        value={newAppointment.time}
                        onValueChange={(value) => setNewAppointment({ ...newAppointment, time: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Service Type</label>
                      <Select
                        value={newAppointment.service_type}
                        onValueChange={(value) => setNewAppointment({ ...newAppointment, service_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="screen_repair">Screen Repair</SelectItem>
                          <SelectItem value="battery_replacement">Battery Replacement</SelectItem>
                          <SelectItem value="water_damage">Water Damage</SelectItem>
                          <SelectItem value="diagnostic">Diagnostic</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea
                        value={newAppointment.notes}
                        onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                        placeholder="Describe the issue or any special requirements"
                      />
                    </div>

                    <Button
                      onClick={bookAppointment}
                      className="w-full"
                      disabled={!newAppointment.time || !newAppointment.service_type}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Appointments</CardTitle>
                    <CardDescription>Scheduled and past appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">
                                {appointment.service_type.replace("_", " ").toUpperCase()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                                {appointment.appointment_time}
                              </div>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status.toUpperCase()}
                            </Badge>
                          </div>
                          {appointment.notes && <p className="text-sm text-gray-600">{appointment.notes}</p>}
                        </div>
                      ))}
                      {appointments.length === 0 && (
                        <div className="text-center py-8">
                          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-semibold text-gray-900">No appointments</h3>
                          <p className="mt-1 text-sm text-gray-500">Book your first appointment to get started.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerPortal

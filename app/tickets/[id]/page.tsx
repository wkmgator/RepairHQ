"use client"

import type React from "react"

import type { ReactElement } from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, DollarSign, XCircle, Edit, Package, Printer, UserCircle, Info } from "lucide-react"
import type { AutoBodyDamageInput, AutoBodyRepairQuote } from "@/lib/ai-chatbot-service"
import { supabase } from "@/lib/supabase" // client-side supabase
import type { WorkOrder, CustomerDevice, Customer, ServiceTemplate } from "@/lib/supabase-types"
import { getIndustryConfig } from "@/lib/industry-config" // To get labels for dynamic fields
import { Label } from "@/components/ui/label"
import type { IndustryConfig } from "@/lib/industry-config" // Import IndustryConfig

interface AutoBodyTicketDetails {
  id: string
  ticket_id: string
  insurance_company?: string
  policy_number?: string
  claim_number?: string
  date_of_loss?: string
  ai_quote_input?: AutoBodyDamageInput
  ai_generated_quote?: AutoBodyRepairQuote
  created_at: string
  updated_at: string
}

interface TicketDetails extends WorkOrder {
  customer_devices: CustomerDevice | null
  customers: Customer | null
  service_templates: ServiceTemplate | null
}

export default function TicketDetailsPage({ params }: { params: { id: string } }): ReactElement {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [ticket, setTicket] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [device, setDevice] = useState<any>(null) // For non-auto-body
  const [vehicleInfo, setVehicleInfo] = useState<any>(null) // For auto-body from tickets table
  const [ticketItems, setTicketItems] = useState<any[]>([])
  const [ticketLabor, setTicketLabor] = useState<any[]>([])
  const [statusHistory, setStatusHistory] = useState<any[]>([])
  const [autoBodyDetails, setAutoBodyDetails] = useState<AutoBodyTicketDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTicketDetails() {
      try {
        setIsLoading(true)
        const supabase = getSupabaseClient()

        // Fetch ticket details
        const { data: ticketData, error: ticketError } = await supabase
          .from("tickets")
          .select("*, vehicle_info:vehicles(*)") // Assuming you have a vehicles table linked
          .eq("id", params.id)
          .single()

        if (ticketError) throw ticketError
        setTicket(ticketData)

        if (ticketData.vehicle_id && ticketData.vehicles) {
          setVehicleInfo(ticketData.vehicles)
        } else if (ticketData.vehicle_info) {
          // if vehicle_info is a JSONB on tickets
          setVehicleInfo(ticketData.vehicle_info)
        }

        // Fetch customer details
        if (ticketData.customer_id) {
          const { data: customerData, error: customerError } = await supabase
            .from("customers")
            .select("*")
            .eq("id", ticketData.customer_id)
            .single()

          if (customerError) throw customerError
          setCustomer(customerData)
        }

        // Fetch device details (for non-auto-body)
        if (ticketData.device_id && ticketData.ticket_type !== "auto_body_repair") {
          const { data: deviceData, error: deviceError } = await supabase
            .from("customer_devices")
            .select("*")
            .eq("id", ticketData.device_id)
            .single()

          if (deviceError) throw deviceError
          setDevice(deviceData)
        }

        // Fetch ticket items
        const { data: itemsData, error: itemsError } = await supabase
          .from("ticket_items")
          .select("*, inventory(*)")
          .eq("ticket_id", params.id)

        if (itemsError) throw itemsError
        setTicketItems(itemsData || [])

        // Fetch ticket labor
        const { data: laborData, error: laborError } = await supabase
          .from("ticket_labor")
          .select("*")
          .eq("ticket_id", params.id)

        if (laborError) throw laborError
        setTicketLabor(laborData || [])

        // Fetch status history
        const { data: historyData, error: historyError } = await supabase
          .from("ticket_status_history")
          .select("*")
          .eq("ticket_id", params.id)
          .order("created_at", { ascending: false })

        if (historyError) throw historyError
        setStatusHistory(historyData || [])

        // Fetch auto body details if applicable
        if (ticketData.ticket_type === "auto_body_repair") {
          const { data: autoBodyData, error: autoBodyError } = await supabase
            .from("auto_body_ticket_details")
            .select("*")
            .eq("ticket_id", params.id)
            .order("created_at", { ascending: false }) // Get the latest if multiple exist
            .limit(1)
            .single()

          if (autoBodyError && autoBodyError.code !== "PGRST116") {
            // PGRST116: no rows found
            console.warn("Error fetching auto body details:", autoBodyError)
            // Not throwing error, as ticket can exist without these details yet
          }
          setAutoBodyDetails(autoBodyData)
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error)
        toast({
          title: "Error",
          description: "Failed to load ticket details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchTicket() {
      if (!params.id) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("work_orders")
          .select(`
            *,
            customer_devices (*),
            customers (*),
            service_templates (*)
          `)
          .eq("id", params.id)
          .single()

        if (error) throw error
        setTicket(data as TicketDetails)
      } catch (error) {
        console.error("Error loading ticket details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTicketDetails()
    fetchTicket()
  }, [params.id, toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
      case "Estimate":
        return <Badge className="bg-yellow-100 text-yellow-800 capitalize">{status}</Badge>
      case "in_progress":
      case "In Progress":
      case "In Body Shop":
      case "In Paint":
      case "Assembly":
        return <Badge className="bg-blue-100 text-blue-800 capitalize">{status}</Badge>
      case "waiting_for_parts":
      case "Awaiting Approval":
      case "Parts Ordered":
        return <Badge className="bg-purple-100 text-purple-800 capitalize">{status}</Badge>
      case "completed":
      case "Quality Check":
      case "Ready for Pickup":
        return <Badge className="bg-green-100 text-green-800 capitalize">{status}</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 capitalize">{status}</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 capitalize">{status || "Unknown"}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      case "medium":
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>
    }
  }

  const formatCurrency = (amount: number | undefined | null) => {
    if (typeof amount !== "number")
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(0)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const supabase = getSupabaseClient()
      const userId = (await supabase.auth.getUser()).data.user?.id || "system"

      // Update ticket status
      const { error: updateError } = await supabase
        .from("tickets")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)

      if (updateError) throw updateError

      // Add status history record
      const { error: historyError } = await supabase.from("ticket_status_history").insert({
        ticket_id: params.id,
        previous_status: ticket.status,
        new_status: newStatus,
        changed_by: userId,
      })

      if (historyError) throw historyError

      // Update local state
      setTicket({ ...ticket, status: newStatus })

      // Fetch updated status history
      const { data: historyData, error: fetchError } = await supabase
        .from("ticket_status_history")
        .select("*")
        .eq("ticket_id", params.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setStatusHistory(historyData || [])

      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating ticket status:", error)
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      })
    }
  }

  const renderDetailItem = (label: string, value: React.ReactNode, icon?: React.ElementType) => {
    const IconComponent = icon
    return (
      <div>
        <span className="text-sm font-medium text-gray-500 flex items-center">
          {IconComponent && <IconComponent className="mr-2 h-4 w-4 text-gray-400" />}
          {label}:
        </span>
        <div className="mt-1">{value || <span className="text-gray-400">N/A</span>}</div>
      </div>
    )
  }

  const industryConfig = ticket?.industry_vertical ? getIndustryConfig(ticket.industry_vertical as any) : null

  const renderJsonbData = (
    data: Record<string, any> | null | undefined,
    title: string,
    schema?:
      | NonNullable<IndustryConfig["deviceAttributesSchema"]>
      | NonNullable<IndustryConfig["ticketCustomFieldsSchema"]>,
  ) => {
    if (!data || Object.keys(data).length === 0) return null

    return (
      <div>
        <h4 className="text-md font-semibold mt-3 mb-1 text-gray-700">{title}</h4>
        <Separator className="mb-2" />
        <dl className="space-y-1 text-sm">
          {Object.entries(data).map(([key, value]) => {
            const fieldSchema = schema?.find((s) => s.name === key)
            const label = fieldSchema?.label || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
            return (
              <div key={key} className="grid grid-cols-2 gap-1">
                <dt className="font-medium text-gray-500">{label}:</dt>
                <dd className="text-gray-800">{typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}</dd>
              </div>
            )
          })}
        </dl>
      </div>
    )
  }

  if (isLoading || loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Loading ticket details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <XCircle className="mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-2xl font-bold">Ticket Not Found</h2>
          <p className="mb-4 text-gray-600">The ticket you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => router.push("/tickets")}>Back to Tickets</Button>
        </div>
      </div>
    )
  }

  const isAutoBodyTicket = ticket.ticket_type === "auto_body_repair"

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Ticket #{ticket.ticket_number}</h1>
            <p className="text-sm text-muted-foreground">
              Status:{" "}
              <Badge variant={ticket.status === "completed" ? "default" : "secondary"}>
                {ticket.status?.replace("_", " ").toUpperCase()}
              </Badge>
              {ticket.priority && (
                <span className="ml-2">
                  Priority: <Badge variant="outline">{ticket.priority.toUpperCase()}</Badge>
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button asChild>
            <Link href={`/tickets/${ticket.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-primary" />
                Ticket Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Issue Description</Label>
                <p className="text-sm">{ticket.issue_description}</p>
              </div>
              {ticket.diagnosis && (
                <div>
                  <Label className="text-xs text-muted-foreground">Diagnosis</Label>
                  <p className="text-sm">{ticket.diagnosis}</p>
                </div>
              )}
              {ticket.notes && (
                <div>
                  <Label className="text-xs text-muted-foreground">Internal Notes</Label>
                  <p className="text-sm bg-amber-50 p-2 rounded">{ticket.notes}</p>
                </div>
              )}
              {renderJsonbData(
                ticket.custom_fields,
                "Additional Ticket Details",
                industryConfig?.ticketCustomFieldsSchema,
              )}
              {ticket.service_templates && (
                <div>
                  <h4 className="text-md font-semibold mt-3 mb-1 text-gray-700">Applied Service Template</h4>
                  <Separator className="mb-2" />
                  <p className="text-sm text-blue-600 hover:underline">
                    <Link href={`/settings/templates/${ticket.service_templates.id}`}>
                      {ticket.service_templates.name}
                    </Link>
                  </p>
                  {ticket.service_templates.description && (
                    <p className="text-xs text-muted-foreground">{ticket.service_templates.description}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {ticket.customer_devices && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-primary" />
                  Device Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-gray-500">Category:</dt>
                    <dd className="text-gray-800">{ticket.customer_devices.device_category}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-500">Name/Model:</dt>
                    <dd className="text-gray-800">{ticket.customer_devices.device_name}</dd>
                  </div>
                  {ticket.customer_devices.serial_number && (
                    <div>
                      <dt className="font-medium text-gray-500">Serial #:</dt>
                      <dd className="text-gray-800">{ticket.customer_devices.serial_number}</dd>
                    </div>
                  )}
                  {ticket.customer_devices.imei && (
                    <div>
                      <dt className="font-medium text-gray-500">IMEI:</dt>
                      <dd className="text-gray-800">{ticket.customer_devices.imei}</dd>
                    </div>
                  )}
                  {ticket.customer_devices.vin && (
                    <div>
                      <dt className="font-medium text-gray-500">VIN:</dt>
                      <dd className="text-gray-800">{ticket.customer_devices.vin}</dd>
                    </div>
                  )}
                </dl>
                {renderJsonbData(
                  ticket.customer_devices.specific_attributes,
                  "Device Specific Attributes",
                  industryConfig?.deviceAttributesSchema,
                )}
                {ticket.customer_devices.notes && (
                  <div>
                    <h4 className="text-md font-semibold mt-3 mb-1 text-gray-700">Device Notes</h4>
                    <Separator className="mb-2" />
                    <p className="text-sm bg-gray-50 p-2 rounded">{ticket.customer_devices.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {ticket.customers && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCircle className="mr-2 h-5 w-5 text-primary" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-semibold">
                  {ticket.customers.first_name} {ticket.customers.last_name}
                </p>
                {ticket.customers.email && <p className="text-gray-600">{ticket.customers.email}</p>}
                {ticket.customers.phone && <p className="text-gray-600">{ticket.customers.phone}</p>}
                {/* Add more customer details or link to customer page */}
                <Button variant="link" asChild className="p-0 h-auto mt-1">
                  <Link href={`/customers/${ticket.customer_id}`}>View Customer</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                Financials
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Estimated Cost:</span>
                <span>${ticket.estimated_cost?.toFixed(2) || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual Cost:</span>
                <span>${ticket.actual_cost?.toFixed(2) || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">${ticket.total_amount?.toFixed(2) || "N/A"}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!ticket.work_order_id}>
                Generate Invoice
              </Button>{" "}
              {/* Assuming work_order_id is the ticket id itself */}
            </CardFooter>
          </Card>
          {/* Add more cards for parts, labor, history etc. */}
        </div>
      </div>
    </div>
  )
}

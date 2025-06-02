"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { getClientSupabaseClient } from "@/lib/supabase-client"
import { Ticket, User, DollarSign, Wrench } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RepairTicket {
  id: string
  ticket_number: string
  customer_id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  device_type: string
  device_brand: string
  device_model: string
  issue_description: string
  estimated_cost: number
  status: "pending" | "in_progress" | "waiting_parts" | "completed" | "picked_up"
  priority: "low" | "medium" | "high" | "urgent"
  assigned_to: string
  created_at: string
  estimated_completion: string
}

export default function TicketSystemComplete() {
  const [tickets, setTickets] = useState<RepairTicket[]>([])
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const { profile } = useAuth()
  const { toast } = useToast()
  const supabase = getClientSupabaseClient()

  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    device_type: "",
    device_brand: "",
    device_model: "",
    issue_description: "",
    estimated_cost: "",
    priority: "medium" as const,
  })

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("repair_tickets")
        .select("*")
        .eq("business_id", profile?.business_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (error) {
      console.error("Error loading tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const createTicket = async () => {
    try {
      const ticketNumber = `TKT-${Date.now()}`

      const ticketData = {
        ...newTicket,
        ticket_number: ticketNumber,
        business_id: profile?.business_id,
        estimated_cost: Number.parseFloat(newTicket.estimated_cost) || 0,
        status: "pending" as const,
        assigned_to: profile?.id,
        estimated_completion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      }

      const { data, error } = await supabase.from("repair_tickets").insert(ticketData).select().single()

      if (error) throw error

      toast({
        title: "Ticket Created",
        description: `Ticket ${ticketNumber} created successfully`,
      })

      setNewTicket({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        device_type: "",
        device_brand: "",
        device_model: "",
        issue_description: "",
        estimated_cost: "",
        priority: "medium",
      })
      setShowNewTicket(false)
      loadTickets()
    } catch (error) {
      console.error("Error creating ticket:", error)
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      })
    }
  }

  const updateTicketStatus = async (ticketId: string, status: RepairTicket["status"]) => {
    try {
      const { error } = await supabase.from("repair_tickets").update({ status }).eq("id", ticketId)

      if (error) throw error

      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${status}`,
      })

      loadTickets()
    } catch (error) {
      console.error("Error updating ticket:", error)
    }
  }

  const getStatusColor = (status: RepairTicket["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "waiting_parts":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "picked_up":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: RepairTicket["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTickets = tickets.filter((ticket) => filterStatus === "all" || ticket.status === filterStatus)

  if (loading) {
    return <div className="p-6">Loading tickets...</div>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Ticket className="h-8 w-8" />
          Repair Tickets
        </h1>
        <Button onClick={() => setShowNewTicket(true)}>Create New Ticket</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <span className="font-medium">Filter by status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting_parts">Waiting Parts</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* New Ticket Form */}
      {showNewTicket && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Repair Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Customer Name"
                value={newTicket.customer_name}
                onChange={(e) => setNewTicket({ ...newTicket, customer_name: e.target.value })}
              />
              <Input
                placeholder="Customer Phone"
                value={newTicket.customer_phone}
                onChange={(e) => setNewTicket({ ...newTicket, customer_phone: e.target.value })}
              />
              <Input
                placeholder="Customer Email"
                value={newTicket.customer_email}
                onChange={(e) => setNewTicket({ ...newTicket, customer_email: e.target.value })}
              />
              <Input
                placeholder="Device Type (e.g., iPhone, Samsung TV)"
                value={newTicket.device_type}
                onChange={(e) => setNewTicket({ ...newTicket, device_type: e.target.value })}
              />
              <Input
                placeholder="Device Brand"
                value={newTicket.device_brand}
                onChange={(e) => setNewTicket({ ...newTicket, device_brand: e.target.value })}
              />
              <Input
                placeholder="Device Model"
                value={newTicket.device_model}
                onChange={(e) => setNewTicket({ ...newTicket, device_model: e.target.value })}
              />
              <Input
                placeholder="Estimated Cost"
                type="number"
                value={newTicket.estimated_cost}
                onChange={(e) => setNewTicket({ ...newTicket, estimated_cost: e.target.value })}
              />
              <Select
                value={newTicket.priority}
                onValueChange={(value: any) => setNewTicket({ ...newTicket, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Issue Description"
              value={newTicket.issue_description}
              onChange={(e) => setNewTicket({ ...newTicket, issue_description: e.target.value })}
              rows={3}
            />

            <div className="flex gap-2">
              <Button onClick={createTicket}>Create Ticket</Button>
              <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{ticket.ticket_number}</CardTitle>
                <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {ticket.customer_name}
                </p>
                <p className="text-sm text-gray-600">{ticket.customer_phone}</p>
              </div>

              <div className="space-y-1">
                <p className="font-medium flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  {ticket.device_brand} {ticket.device_model}
                </p>
                <p className="text-sm text-gray-600">{ticket.device_type}</p>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">{ticket.issue_description}</p>

              <div className="flex justify-between items-center">
                <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                <span className="font-bold text-green-600 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {ticket.estimated_cost}
                </span>
              </div>

              <div className="flex gap-2">
                <Select value={ticket.status} onValueChange={(value: any) => updateTicketStatus(ticket.id, value)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="waiting_parts">Waiting Parts</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="picked_up">Picked Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No tickets found</h3>
            <p className="text-gray-500">
              {filterStatus === "all"
                ? "Create your first repair ticket to get started"
                : `No tickets with status "${filterStatus}"`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

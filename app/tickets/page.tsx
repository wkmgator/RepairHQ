"use client"
import TicketSystemComplete from "@/components/ticket-system-complete"

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
}

interface Ticket {
  id: string
  ticket_number: string
  customer_id: string
  device_type: string
  device_brand: string
  device_model: string
  issue_description: string
  status: string
  priority: string
  estimated_cost: number
  created_at: string
  updated_at: string
  actual_completion: string | null
}

export default function TicketsPage() {
  return <TicketSystemComplete />
}

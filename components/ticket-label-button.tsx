"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Ticket } from "lucide-react"
import { TicketLabelGenerator } from "@/components/ticket-label-generator"
import { format } from "date-fns"

interface TicketLabelButtonProps {
  ticket: any
  customer: any
  device: any
}

export function TicketLabelButton({ ticket, customer, device }: TicketLabelButtonProps) {
  const [open, setOpen] = useState(false)

  // Prepare initial data for the ticket label generator
  const initialData = {
    customerName: customer ? `${customer.first_name} ${customer.last_name}` : "",
    phoneNumber: customer?.phone || "",
    ticketNumber: ticket.ticket_number,
    deviceType: device?.device_type || "Phone",
    deviceModel: device ? `${device.brand} ${device.model}` : "",
    deviceColor: device?.color || "",
    devicePassword: ticket.device_password || "",
    issueDescription: ticket.issue_description || "",
    dateReceived: ticket.created_at
      ? format(new Date(ticket.created_at), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
    estimatedCompletion: ticket.estimated_completion
      ? format(new Date(ticket.estimated_completion), "yyyy-MM-dd")
      : format(new Date(Date.now() + 86400000 * 3), "yyyy-MM-dd"),
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Ticket className="h-4 w-4 mr-2" />
          Print Ticket Label
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Print Ticket Label</DialogTitle>
        </DialogHeader>
        <TicketLabelGenerator initialData={initialData} />
      </DialogContent>
    </Dialog>
  )
}

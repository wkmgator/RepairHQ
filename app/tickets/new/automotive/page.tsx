import type { Metadata } from "next"
import { AutomotiveTicketFormWithVin } from "@/components/automotive-ticket-form-with-vin"

export const metadata: Metadata = {
  title: "New Automotive Ticket | RepairHQ",
  description: "Create a new automotive service ticket with VIN lookup",
}

export default function NewAutomotiveTicketPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Automotive Ticket</h1>
        <p className="text-muted-foreground">Create a new service ticket for automotive repair with VIN lookup</p>
      </div>

      <AutomotiveTicketFormWithVin />
    </div>
  )
}

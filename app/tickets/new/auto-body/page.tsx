import type { Metadata } from "next"
import { AutoBodyTicketForm } from "@/components/auto-body-ticket-form"

export const metadata: Metadata = {
  title: "New Auto Body Ticket | RepairHQ",
  description: "Create a new auto body repair service ticket.",
}

export default function NewAutoBodyTicketPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Auto Body Repair Ticket</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new service ticket for auto body work.
        </p>
      </div>
      <AutoBodyTicketForm />
    </div>
  )
}

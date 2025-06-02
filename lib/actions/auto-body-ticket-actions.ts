"use server"

import { createClient } from "@/lib/supabase/server" // Assuming server client setup
import type { AutoBodyDamageInput, AutoBodyRepairQuote } from "@/lib/ai-chatbot-service"
import { revalidatePath } from "next/cache"

export interface AutoBodyTicketFormData {
  customerId: string // Assuming customer ID is available
  vehicleId?: string // If vehicle is already in system
  vin?: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  vehicleColor?: string
  licensePlate?: string
  mileage?: number

  insuranceCompany?: string
  policyNumber?: string
  claimNumber?: string
  dateOfLoss?: string // ISO date string

  damageDescription: string
  damagedParts: string[]
  damageSeverity: "minor" | "moderate" | "severe"
  paintRequired: boolean

  aiQuoteInput?: AutoBodyDamageInput
  aiGeneratedQuote?: AutoBodyRepairQuote

  assignedTechnicianId?: string
  status?: string // e.g., 'Estimate', 'Awaiting Approval', 'In Progress'
  estimatedCompletionDate?: string // ISO date string
  notes?: string
}

export async function createAutoBodyTicket(formData: AutoBodyTicketFormData) {
  const supabase = createClient()

  // Basic validation (more robust validation should be added, e.g., with Zod)
  if (!formData.customerId || !formData.vehicleMake || !formData.vehicleModel || !formData.damageDescription) {
    return { success: false, error: "Missing required fields." }
  }

  try {
    // Start a transaction if multiple inserts are needed
    // For simplicity, let's assume a single insert into a 'tickets' table
    // and a related 'auto_body_ticket_details' table.

    // 1. Create the main ticket entry
    //    This depends on your 'tickets' table structure.
    //    Let's assume it has common fields like customer_id, vehicle_id, status, etc.
    const { data: ticketData, error: ticketError } = await supabase
      .from("tickets")
      .insert({
        customer_id: formData.customerId,
        // vehicle_id: formData.vehicleId, // Handle vehicle creation/linking separately if needed
        ticket_type: "auto_body_repair", // Or use industry_id
        status: formData.status || "Estimate",
        description: formData.damageDescription.substring(0, 255), // Main description
        assigned_to: formData.assignedTechnicianId,
        // ... other common ticket fields
      })
      .select("id")
      .single()

    if (ticketError) {
      console.error("Error creating ticket:", ticketError)
      return { success: false, error: ticketError.message }
    }

    const newTicketId = ticketData.id

    // 2. Create the auto_body_ticket_details entry
    const { error: autoBodyDetailsError } = await supabase.from("auto_body_ticket_details").insert({
      ticket_id: newTicketId,
      insurance_company: formData.insuranceCompany,
      policy_number: formData.policyNumber,
      claim_number: formData.claimNumber,
      date_of_loss: formData.dateOfLoss,
      ai_quote_input: formData.aiQuoteInput,
      ai_generated_quote: formData.aiGeneratedQuote,
      // ... also save vehicle specific details if not in a separate vehicle table linked to ticket
      // e.g., vin: formData.vin, make: formData.vehicleMake, model: formData.vehicleModel, year: formData.vehicleYear
    })

    if (autoBodyDetailsError) {
      console.error("Error creating auto body details:", autoBodyDetailsError)
      // Potentially roll back the main ticket creation or mark it as incomplete
      return { success: false, error: autoBodyDetailsError.message }
    }

    revalidatePath("/tickets")
    revalidatePath(`/tickets/${newTicketId}`)
    revalidatePath("/dashboard") // Or specific auto body dashboard path

    return { success: true, ticketId: newTicketId, message: "Auto body ticket created successfully." }
  } catch (error) {
    console.error("Unexpected error creating auto body ticket:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { RepairIndustry } from "@/lib/industry-config"
import { Buffer } from "buffer"

interface CreateTicketPayload {
  customer_id: string
  device_category: string
  device_name: string
  device_serial_number?: string
  device_imei?: string
  device_vin?: string
  device_specific_attributes?: Record<string, any>
  issue_description: string
  estimated_cost?: number
  priority: "low" | "medium" | "high" | "urgent"
  notes?: string
  ticket_custom_fields?: Record<string, any>
  service_template_id?: string
  ticket_number: string
  industry_vertical: RepairIndustry
  signature_data_url?: string
}

export async function createTicketWithDevice(payload: CreateTicketPayload) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated." }
  }

  let signatureImageUrl: string | null = null

  try {
    // 0. Handle Signature Upload if present
    if (payload.signature_data_url) {
      const base64Data = payload.signature_data_url.replace(/^data:image\/png;base64,/, "")
      const signatureBuffer = Buffer.from(base64Data, "base64")
      const filePath = `signatures/${user.id}/${payload.ticket_number}-${Date.now()}.png`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("signatures")
        .upload(filePath, signatureBuffer, {
          contentType: "image/png",
          upsert: true,
        })

      if (uploadError) {
        console.error("Error uploading signature:", uploadError)
      } else {
        const { data: publicUrlData } = supabase.storage.from("signatures").getPublicUrl(filePath)
        signatureImageUrl = publicUrlData.publicUrl
      }
    }

    // 1. Create or find CustomerDevice
    const { data: customerDevice, error: deviceError } = await supabase
      .from("customer_devices")
      .insert({
        customer_id: payload.customer_id,
        user_id: user.id,
        device_category: payload.device_category,
        device_name: payload.device_name,
        serial_number: payload.device_serial_number,
        imei: payload.device_imei,
        vin: payload.device_vin,
        specific_attributes: payload.device_specific_attributes || {},
      })
      .select()
      .single()

    if (deviceError) throw new Error(`Failed to create customer device: ${deviceError.message}`)

    // 2. Create WorkOrder (Ticket)
    const { data: ticket, error: ticketError } = await supabase
      .from("work_orders")
      .insert({
        user_id: user.id,
        customer_id: payload.customer_id,
        customer_device_id: customerDevice.id,
        ticket_number: payload.ticket_number,
        device_type: payload.device_category,
        device_model: payload.device_name,
        serial_number: payload.device_serial_number,
        imei: payload.device_imei,
        issue_description: payload.issue_description,
        estimated_cost: payload.estimated_cost,
        priority: payload.priority,
        notes: payload.notes,
        custom_fields: payload.ticket_custom_fields || {},
        service_template_id: payload.service_template_id,
        status: "pending",
        signature_image_url: signatureImageUrl,
      })
      .select()
      .single()

    if (ticketError) throw new Error(`Failed to create ticket: ${ticketError.message}`)

    revalidatePath("/tickets")
    revalidatePath(`/tickets/${ticket.id}`)
    return { success: true, ticketId: ticket.id }
  } catch (error: any) {
    console.error("Transaction error in createTicketWithDevice:", error)
    return { success: false, error: error.message }
  }
}

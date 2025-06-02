import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("business_id")
    const status = searchParams.get("status")

    let query = supabase.from("repair_tickets").select("*").order("created_at", { ascending: false })

    if (businessId) {
      query = query.eq("business_id", businessId)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ tickets: data })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    const ticketData = {
      ...body,
      ticket_number: `TKT-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: "pending",
    }

    const { data, error } = await supabase.from("repair_tickets").insert(ticketData).select().single()

    if (error) throw error

    return NextResponse.json({ ticket: data })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await supabase.from("repair_tickets").update(updates).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json({ ticket: data })
  } catch (error) {
    console.error("Error updating ticket:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}

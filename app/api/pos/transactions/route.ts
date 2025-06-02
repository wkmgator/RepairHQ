import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("business_id")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from("pos_transactions").select("*").order("created_at", { ascending: false }).limit(limit)

    if (businessId) {
      query = query.eq("business_id", businessId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ transactions: data })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()

    // Start a transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("pos_transactions")
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        transaction_number: `TXN-${Date.now()}`,
      })
      .select()
      .single()

    if (transactionError) throw transactionError

    // Update inventory quantities
    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        const { error: inventoryError } = await supabase
          .from("inventory_items")
          .update({
            stock_quantity: supabase.raw(`stock_quantity - ${item.quantity}`),
          })
          .eq("id", item.id)

        if (inventoryError) {
          console.error("Inventory update error:", inventoryError)
        }
      }
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error processing transaction:", error)
    return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 })
  }
}

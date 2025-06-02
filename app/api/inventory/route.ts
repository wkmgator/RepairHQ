import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/supabase-client"

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase.from("inventory_items").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch inventory" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, sku, quantity, price, cost, category, supplier, low_stock_threshold } = body

    const { data, error } = await supabase
      .from("inventory_items")
      .insert([
        {
          name,
          sku,
          quantity,
          price,
          cost,
          category,
          supplier,
          low_stock_threshold,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json({ success: false, error: "Failed to create inventory item" }, { status: 500 })
  }
}

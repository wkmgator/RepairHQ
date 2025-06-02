"use server"

import { supabase } from "@/lib/supabase" // Use server client
import { POSService } from "@/lib/pos-utils" // Assuming this service exists and is set up for server use
import type { POSTransaction } from "@/lib/pos-utils"
import type { InventoryItem, Customer } from "@/lib/supabase-types" // Ensure these types are defined

export async function searchInventoryItems(query: string): Promise<{ data: InventoryItem[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .or(`name.ilike.%${query}%,sku.ilike.%${query}%,barcode.ilike.%${query}%`)
      .gt("quantity_in_stock", 0) // Only items in stock
      .limit(10)

    if (error) {
      console.error("Error searching inventory:", error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (e) {
    return { data: null, error: e }
  }
}

export async function searchCustomers(query: string): Promise<{ data: Customer[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("id, first_name, last_name, email, phone")
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(10)

    if (error) {
      console.error("Error searching customers:", error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (e) {
    return { data: null, error: e }
  }
}

export async function processPOSTransaction(
  transactionData: Omit<POSTransaction, "id" | "created_at" | "updated_at">,
): Promise<{ data: { transaction_id: string; receipt_data: any } | null; error: any }> {
  try {
    // Here you would call your POSService or directly interact with Supabase
    // For simplicity, let's assume POSService handles the database interactions
    const result = await POSService.processTransaction(transactionData as POSTransaction)

    if (!result.success || !result.transaction_id) {
      return { data: null, error: { message: result.message || "Transaction failed" } }
    }

    return { data: { transaction_id: result.transaction_id, receipt_data: result.receipt_data }, error: null }
  } catch (error: any) {
    console.error("Error processing POS transaction:", error)
    return { data: null, error: { message: error.message || "An unexpected error occurred" } }
  }
}

export async function getInventoryItemById(itemId: string): Promise<{ data: InventoryItem | null; error: any }> {
  try {
    const { data, error } = await supabase.from("inventory_items").select("*").eq("id", itemId).single()
    if (error) {
      console.error("Error fetching inventory item:", error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (e) {
    return { data: null, error: e }
  }
}

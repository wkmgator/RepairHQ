import { createClient } from "@/lib/supabase/server"
import type { Customer } from "@/lib/supabase-types"

export async function getCustomerById(id: string): Promise<Customer | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching customer:", error)
      return null
    }

    return data as Customer
  } catch (error) {
    console.error("Error in getCustomerById:", error)
    return null
  }
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("customers").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating customer:", error)
      return null
    }

    return data as Customer
  } catch (error) {
    console.error("Error in updateCustomer:", error)
    return null
  }
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting customer:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteCustomer:", error)
    return false
  }
}

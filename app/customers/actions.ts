"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase-types" // Assuming this is generated or aligned with lib/supabase.ts
import type { CustomerFormData } from "@/lib/customer-schema"

export async function getCustomers() {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated", customers: [] }
  }

  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return { error: error.message, customers: [] }
  }
  return { customers: customers || [] }
}

export async function addCustomer(formData: CustomerFormData) {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      ...formData,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding customer:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/customers")
  return { success: true, customer: data }
}

export async function getCustomerById(customerId: string) {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated", customer: null }
  }

  const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching customer by ID:", error)
    return { error: error.message, customer: null }
  }
  return { customer }
}

// Placeholder for updateCustomer - implement when edit functionality is added
export async function updateCustomer(customerId: string, formData: CustomerFormData) {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  const { data, error } = await supabase
    .from("customers")
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customerId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating customer:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/customers")
  revalidatePath(`/customers/${customerId}`)
  return { success: true, customer: data }
}

// Placeholder for deleteCustomer - implement when delete functionality is added
export async function deleteCustomer(customerId: string) {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated" }
  }

  const { error } = await supabase.from("customers").delete().eq("id", customerId).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting customer:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/customers")
  return { success: true }
}

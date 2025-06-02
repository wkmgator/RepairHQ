"use server"

import { resellerService } from "@/lib/reseller-service"
import { createClient } from "@/lib/supabase/server" // Use server client for auth checks
import { revalidatePath } from "next/cache"

export interface ActionResponse {
  success: boolean
  message: string
  error?: string
}

async function verifyAdmin(): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  // Fetch user profile to check role
  // This assumes your user profiles table is named 'users' and has a 'role' column.
  // Adjust if your table/column names are different.
  const { data: profile, error } = await supabase
    .from("users") // Or your user_profiles table
    .select("role")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    console.error("Error fetching user profile for admin check:", error)
    return false
  }
  return profile.role === "admin"
}

export async function approveCommissionAction(referralId: string): Promise<ActionResponse> {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    return { success: false, message: "Unauthorized: Admin access required." }
  }

  try {
    await resellerService.updateCommissionStatus(referralId, "approved")
    revalidatePath("/admin/commissions")
    return { success: true, message: "Commission approved successfully." }
  } catch (error: any) {
    console.error("Error approving commission:", error)
    return { success: false, message: "Failed to approve commission.", error: error.message }
  }
}

export async function rejectCommissionAction(referralId: string): Promise<ActionResponse> {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) {
    return { success: false, message: "Unauthorized: Admin access required." }
  }

  try {
    await resellerService.updateCommissionStatus(referralId, "rejected")
    revalidatePath("/admin/commissions")
    return { success: true, message: "Commission rejected successfully." }
  } catch (error: any) {
    console.error("Error rejecting commission:", error)
    return { success: false, message: "Failed to reject commission.", error: error.message }
  }
}

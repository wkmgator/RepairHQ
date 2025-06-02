"use server"

import { resellerService } from "@/lib/reseller-service"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface ActionResponse {
  success: boolean
  message: string
  error?: string
  data?: any
}

async function verifyAdminAndGetUser(): Promise<{ isAdmin: boolean; userId: string | null; error?: string }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isAdmin: false, userId: null, error: "User not authenticated." }
  }

  const { data: profile, error: profileError } = await supabase
    .from("users") // Assuming your user profiles table is 'users'
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    console.error("Error fetching user profile for admin check:", profileError)
    return { isAdmin: false, userId: user.id, error: "Failed to verify user profile." }
  }

  if (profile.role !== "admin") {
    return { isAdmin: false, userId: user.id, error: "User is not an admin." }
  }

  return { isAdmin: true, userId: user.id }
}

export async function fetchResellersWithPayableCommissionsAction(): Promise<ActionResponse> {
  const { isAdmin, error: adminError } = await verifyAdminAndGetUser()
  if (!isAdmin) {
    return { success: false, message: adminError || "Unauthorized: Admin access required." }
  }

  try {
    const data = await resellerService.getResellersWithPayableCommissions()
    return { success: true, message: "Fetched resellers with payable commissions.", data }
  } catch (error: any) {
    console.error("Error in fetchResellersWithPayableCommissionsAction:", error)
    return { success: false, message: "Failed to fetch resellers.", error: error.message }
  }
}

export async function fetchApprovedUnpaidCommissionsForResellerAction(resellerId: string): Promise<ActionResponse> {
  const { isAdmin, error: adminError } = await verifyAdminAndGetUser()
  if (!isAdmin) {
    return { success: false, message: adminError || "Unauthorized: Admin access required." }
  }

  if (!resellerId) {
    return { success: false, message: "Reseller ID is required." }
  }

  try {
    const data = await resellerService.getApprovedUnpaidCommissionsForReseller(resellerId)
    return { success: true, message: "Fetched approved unpaid commissions.", data }
  } catch (error: any) {
    console.error("Error in fetchApprovedUnpaidCommissionsForResellerAction:", error)
    return { success: false, message: "Failed to fetch commissions for reseller.", error: error.message }
  }
}

export async function processPayoutAction(
  resellerId: string,
  payoutAmount: number,
  paymentMethod: string,
  transactionReference: string,
  selectedReferralIds: string[],
): Promise<ActionResponse> {
  const { isAdmin, userId, error: adminError } = await verifyAdminAndGetUser()
  if (!isAdmin || !userId) {
    return { success: false, message: adminError || "Unauthorized: Admin access required." }
  }

  if (!resellerId || payoutAmount <= 0 || !paymentMethod || selectedReferralIds.length === 0) {
    return {
      success: false,
      message: "Missing required fields: resellerId, payoutAmount, paymentMethod, or selectedReferralIds.",
    }
  }

  try {
    const payoutRecord = await resellerService.createPayoutAndUpdateCommissions(
      resellerId,
      payoutAmount,
      paymentMethod,
      transactionReference,
      selectedReferralIds,
      userId, // adminUserId
    )
    revalidatePath("/admin/payouts")
    revalidatePath("/admin/commissions") // Also revalidate commissions page
    return { success: true, message: "Payout processed successfully.", data: payoutRecord }
  } catch (error: any) {
    console.error("Error processing payout:", error)
    return { success: false, message: "Failed to process payout.", error: error.message }
  }
}

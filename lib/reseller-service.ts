import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

const SIGNUP_COMMISSION_AMOUNT = 5.0

export interface ResellerProfile {
  id: string
  user_id: string
  referral_code: string
  upline_reseller_id?: string | null
  commission_rate: number
  status: "active" | "pending" | "suspended"
  created_at: string
  updated_at: string
  payout_details?: any // For storing PayPal email, etc.
  user_email?: string // Joined data
}

export interface Referral {
  id: string
  reseller_id: string
  referred_user_id: string
  referred_customer_id?: string | null
  conversion_type: string
  conversion_details?: any
  commission_earned: number
  commission_status: "pending" | "approved" | "paid" | "rejected"
  created_at: string
  payout_id?: string | null // Link to commission_payouts table
  referred_user_email?: string
  reseller_user_email?: string
}

export interface CommissionPayout {
  id: string
  reseller_id: string
  amount: number
  payout_date: string
  status: "pending" | "processing" | "completed" | "failed"
  payment_method?: string | null
  transaction_reference?: string | null
  notes?: string | null
  processed_by?: string | null // User ID of admin
  created_at: string
  updated_at: string
}

export interface ResellerDashboardData {
  profile: ResellerProfile | null
  referralLink: string
  totalReferrals: number
  convertedReferrals: number
  pendingCommissions: number
  paidCommissions: number
  recentReferrals: Referral[]
  recentPayouts: CommissionPayout[]
}

export interface ResellerPayableSummary {
  reseller_id: string
  reseller_user_id: string
  reseller_email: string // Joined from users table via resellers table
  total_payable_amount: number
  payable_commission_count: number
}

const generateReferralCode = (length = 8): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export class ResellerService {
  private supabase = createClient()

  async getResellerProfile(userId: string): Promise<ResellerProfile | null> {
    const { data, error } = await this.supabase
      .from("resellers")
      .select("*, user:users!resellers_user_id_fkey(email)")
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching reseller profile:", error)
      throw error
    }
    if (data) {
      return { ...data, user_email: (data.user as any)?.email }
    }
    return null
  }

  async createResellerProfile(userId: string, uplineResellerCode?: string): Promise<ResellerProfile> {
    let upline_reseller_id: string | null = null
    if (uplineResellerCode) {
      const { data: upline } = await this.supabase
        .from("resellers")
        .select("id")
        .eq("referral_code", uplineResellerCode)
        .single()
      if (upline) {
        upline_reseller_id = upline.id
      }
    }

    const referral_code = generateReferralCode()
    const { data, error } = await this.supabase
      .from("resellers")
      .insert({
        user_id: userId,
        referral_code,
        upline_reseller_id,
        commission_rate: 10.0,
        status: "active",
      })
      .select("*, user:users!resellers_user_id_fkey(email)")
      .single()

    if (error) {
      console.error("Error creating reseller profile:", error)
      if (error.message.includes("duplicate key value violates unique constraint")) {
        return this.createResellerProfile(userId, uplineResellerCode)
      }
      throw error
    }
    return { ...data, user_email: (data.user as any)?.email }
  }

  async getResellerDashboardData(user: User): Promise<ResellerDashboardData | null> {
    const resellerProfile = await this.getResellerProfile(user.id)

    const referralLink = resellerProfile
      ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/signup?ref=${resellerProfile.referral_code}`
      : ""

    if (!resellerProfile) {
      return {
        profile: null,
        referralLink: "N/A - Become a reseller to get your link.",
        totalReferrals: 0,
        convertedReferrals: 0,
        pendingCommissions: 0,
        paidCommissions: 0,
        recentReferrals: [],
        recentPayouts: [],
      }
    }

    const { data: referralsData, error: referralsError } = await this.supabase
      .from("referrals")
      .select(
        "*, referred_user:users!referrals_referred_user_id_fkey(email), reseller:resellers!inner(user:users!resellers_user_id_fkey(email))",
      )
      .eq("reseller_id", resellerProfile.id)
      .order("created_at", { ascending: false })

    if (referralsError) {
      console.error("Error fetching referrals for dashboard:", referralsError)
    }

    const formattedReferrals = (referralsData || []).map((r) => ({
      ...r,
      referred_user_email: (r.referred_user as any)?.email,
      reseller_user_email: (r.reseller as any)?.user?.email,
    }))

    const totalReferrals = formattedReferrals.length || 0
    const convertedReferrals =
      formattedReferrals?.filter((r) => r.commission_status === "approved" || r.commission_status === "paid").length ||
      0
    const pendingCommissions =
      formattedReferrals
        ?.filter((r) => r.commission_status === "pending" || r.commission_status === "approved")
        .reduce((sum, r) => sum + r.commission_earned, 0) || 0

    const paidCommissionsData = await this.supabase
      .from("commission_payouts")
      .select("amount")
      .eq("reseller_id", resellerProfile.id)
      .eq("status", "completed")

    const paidCommissions = paidCommissionsData.data?.reduce((sum, p) => sum + p.amount, 0) || 0

    const { data: recentPayoutsData, error: payoutsError } = await this.supabase
      .from("commission_payouts")
      .select("*")
      .eq("reseller_id", resellerProfile.id)
      .order("payout_date", { ascending: false })
      .limit(5)

    if (payoutsError) {
      console.error("Error fetching payouts:", payoutsError)
    }

    return {
      profile: resellerProfile,
      referralLink,
      totalReferrals,
      convertedReferrals,
      pendingCommissions,
      paidCommissions,
      recentReferrals: formattedReferrals.slice(0, 5) as Referral[],
      recentPayouts: (recentPayoutsData || []) as CommissionPayout[],
    }
  }

  async recordReferral(
    resellerCode: string,
    referredUserId: string,
    conversionType = "signup",
    conversionDetails?: any,
    explicitCommissionAmount?: number,
  ): Promise<Referral | null> {
    const { data: reseller } = await this.supabase
      .from("resellers")
      .select("id, commission_rate")
      .eq("referral_code", resellerCode)
      .single()

    if (!reseller) {
      console.warn(`Invalid reseller code: ${resellerCode}`)
      return null
    }

    let finalCommissionEarned = 0
    if (conversionType === "signup") {
      finalCommissionEarned =
        explicitCommissionAmount && explicitCommissionAmount > 0 ? explicitCommissionAmount : SIGNUP_COMMISSION_AMOUNT
    } else if (explicitCommissionAmount && explicitCommissionAmount > 0) {
      finalCommissionEarned = explicitCommissionAmount
    }

    const { data: newReferral, error } = await this.supabase
      .from("referrals")
      .insert({
        reseller_id: reseller.id,
        referred_user_id: referredUserId,
        conversion_type: conversionType,
        conversion_details: conversionDetails,
        commission_earned: finalCommissionEarned,
        commission_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error recording referral:", error)
      throw error
    }
    console.log(
      `Referral recorded for ${referredUserId} via ${resellerCode}. Commission: $${finalCommissionEarned} (pending)`,
    )
    return newReferral
  }

  async getPendingCommissions(): Promise<Referral[]> {
    const { data, error } = await this.supabase
      .from("referrals")
      .select(
        `
        *,
        referred_user:users!referrals_referred_user_id_fkey(email),
        reseller:resellers!inner(user:users!resellers_user_id_fkey(email))
      `,
      )
      .eq("commission_status", "pending")
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching pending commissions:", error)
      throw error
    }

    return (data || []).map((r) => ({
      ...r,
      referred_user_email: (r.referred_user as any)?.email,
      reseller_user_email: (r.reseller as any)?.user?.email,
    })) as Referral[]
  }

  async updateCommissionStatus(referralId: string, status: "approved" | "rejected"): Promise<Referral | null> {
    const { data, error } = await this.supabase
      .from("referrals")
      .update({
        commission_status: status,
      })
      .eq("id", referralId)
      .select()
      .single()

    if (error) {
      console.error(`Error updating commission status for referral ${referralId}:`, error)
      throw error
    }
    return data
  }

  // --- Payout Specific Methods ---

  async getResellersWithPayableCommissions(): Promise<ResellerPayableSummary[]> {
    const { data, error } = await this.supabase.rpc("get_resellers_payable_summary")

    if (error) {
      console.error("Error fetching resellers with payable commissions:", error)
      throw error
    }
    return data || []
  }

  async getApprovedUnpaidCommissionsForReseller(resellerId: string): Promise<Referral[]> {
    const { data, error } = await this.supabase
      .from("referrals")
      .select(
        `
        *,
        referred_user:users!referrals_referred_user_id_fkey(email)
      `,
      )
      .eq("reseller_id", resellerId)
      .eq("commission_status", "approved")
      .is("payout_id", null)
      .order("created_at", { ascending: true })

    if (error) {
      console.error(`Error fetching approved unpaid commissions for reseller ${resellerId}:`, error)
      throw error
    }
    return (data || []).map((r) => ({
      ...r,
      referred_user_email: (r.referred_user as any)?.email,
    })) as Referral[]
  }

  async createPayoutAndUpdateCommissions(
    resellerId: string,
    payoutAmount: number,
    paymentMethod: string,
    transactionReference: string,
    selectedReferralIds: string[],
    adminUserId: string,
  ): Promise<CommissionPayout | null> {
    const { data: payoutRecord, error: payoutError } = await this.supabase
      .from("commission_payouts")
      .insert({
        reseller_id: resellerId,
        amount: payoutAmount,
        payment_method: paymentMethod,
        transaction_reference: transactionReference,
        status: "completed",
        processed_by: adminUserId,
        payout_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (payoutError) {
      console.error("Error creating payout record:", payoutError)
      throw payoutError
    }

    if (!payoutRecord) {
      throw new Error("Failed to create payout record.")
    }

    const { error: updateError } = await this.supabase
      .from("referrals")
      .update({
        commission_status: "paid",
        payout_id: payoutRecord.id,
      })
      .in("id", selectedReferralIds)

    if (updateError) {
      console.error("Error updating referrals to paid status:", updateError)
      await this.supabase
        .from("commission_payouts")
        .update({ status: "failed", notes: "Failed to update referrals" })
        .eq("id", payoutRecord.id)
      throw updateError
    }

    return payoutRecord
  }
}

export const resellerService = new ResellerService()

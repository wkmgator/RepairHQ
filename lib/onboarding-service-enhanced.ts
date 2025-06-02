import { createClient } from "@/lib/supabase/client"
import { planConfigs } from "./plan-config"
import type { VerticalGroup, Vertical } from "./vertical-groups"

export interface OnboardingData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone?: string

  // Business Info
  businessName: string
  verticalGroup: VerticalGroup
  vertical: Vertical

  // Location Info
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string

  // Plan
  selectedPlan: string
}

export class OnboardingService {
  private supabase = createClient()

  async createUserAccount(email: string, password: string, userData: OnboardingData) {
    try {
      // Get the current authenticated user (they should already be signed up from step 1)
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // 1. Update user profile with complete information
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 30) // 30-day trial

      const { error: profileError } = await this.supabase
        .from("users")
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          role: "owner",
          plan: userData.selectedPlan,
          trial_ends_at: trialEndDate.toISOString(),
          is_trial_active: true,
          onboarding_completed: true,
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      // 2. Create primary store
      const { data: storeData, error: storeError } = await this.supabase
        .from("stores")
        .insert({
          owner_id: user.id,
          name: userData.businessName,
          vertical_group: userData.verticalGroup,
          vertical: userData.vertical,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          zip_code: userData.zipCode,
          country: userData.country || "US",
          phone: userData.phone,
          email: userData.email,
          is_primary: true,
        })
        .select()
        .single()

      if (storeError) throw storeError

      return {
        user: user,
        store: storeData,
        success: true,
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      return {
        user: null,
        store: null,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  async checkPlanLimits(userId: string, action: "add_location" | "add_user" | "add_customer" | "add_inventory") {
    try {
      // Get user's current plan
      const { data: user, error: userError } = await this.supabase
        .from("users")
        .select("plan")
        .eq("id", userId)
        .single()

      if (userError) throw userError

      const planConfig = planConfigs[user.plan]
      if (!planConfig) throw new Error("Invalid plan")

      // Get current counts based on the existing table structure
      const [{ count: storeCount }, { count: customerCount }, { count: inventoryCount }] = await Promise.all([
        this.supabase.from("stores").select("*", { count: "exact", head: true }).eq("owner_id", userId),
        this.supabase.from("customers").select("*", { count: "exact", head: true }).eq("user_id", userId),
        this.supabase.from("inventory_items").select("*", { count: "exact", head: true }).eq("user_id", userId),
      ])

      // Check limits using the correct column names
      const limits = {
        stores: planConfig.limits.locations,
        users: planConfig.limits.users,
        customers: planConfig.limits.customers,
        inventory: planConfig.limits.inventory,
      }

      const checks = {
        stores: limits.stores === "unlimited" || (storeCount || 0) < limits.stores,
        customers: limits.customers === "unlimited" || (customerCount || 0) < limits.customers,
        inventory: limits.inventory === "unlimited" || (inventoryCount || 0) < limits.inventory,
      }

      switch (action) {
        case "add_location":
          return { allowed: checks.stores, current: storeCount, limit: limits.stores }
        case "add_customer":
          return { allowed: checks.customers, current: customerCount, limit: limits.customers }
        case "add_inventory":
          return { allowed: checks.inventory, current: inventoryCount, limit: limits.inventory }
        default:
          return { allowed: false, current: 0, limit: 0 }
      }
    } catch (error) {
      console.error("Error checking plan limits:", error)
      return { allowed: false, current: 0, limit: 0, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}

export const onboardingService = new OnboardingService()

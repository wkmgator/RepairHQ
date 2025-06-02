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
      // 1. Create auth user
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("Failed to create user")

      // 2. Create user profile
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 30) // 30-day trial

      const { error: profileError } = await this.supabase.from("users").insert({
        id: authData.user.id,
        email: authData.user.email!,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        role: "owner",
        plan: userData.selectedPlan,
        trial_ends_at: trialEndDate.toISOString(),
        is_trial_active: true,
        onboarding_completed: false,
      })

      if (profileError) throw profileError

      // 3. Create primary store
      const { data: storeData, error: storeError } = await this.supabase
        .from("stores")
        .insert({
          owner_id: authData.user.id,
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

      // 4. Mark onboarding as completed
      const { error: updateError } = await this.supabase
        .from("users")
        .update({ onboarding_completed: true })
        .eq("id", authData.user.id)

      if (updateError) throw updateError

      return {
        user: authData.user,
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

      // Get current counts
      const [{ count: locationCount }, { count: userCount }, { count: customerCount }, { count: inventoryCount }] =
        await Promise.all([
          this.supabase.from("stores").select("*", { count: "exact", head: true }).eq("owner_id", userId),
          this.supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("id", userId), // This would need to be updated for multi-user stores
          this.supabase.from("customers").select("*", { count: "exact", head: true }).eq("user_id", userId),
          this.supabase.from("inventory_items").select("*", { count: "exact", head: true }).eq("user_id", userId),
        ])

      // Check limits
      const limits = planConfig.limits
      const checks = {
        locations: limits.locations === "unlimited" || (locationCount || 0) < limits.locations,
        users: limits.users === "unlimited" || (userCount || 0) < limits.users,
        customers: limits.customers === "unlimited" || (customerCount || 0) < limits.customers,
        inventory: limits.inventory === "unlimited" || (inventoryCount || 0) < limits.inventory,
      }

      switch (action) {
        case "add_location":
          return { allowed: checks.locations, current: locationCount, limit: limits.locations }
        case "add_user":
          return { allowed: checks.users, current: userCount, limit: limits.users }
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

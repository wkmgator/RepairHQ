import { createClient } from "@/lib/supabase"
import { stripe } from "@/lib/stripe-config"
import type { Plan } from "@/lib/supabase-types"

export interface UsageMetrics {
  workOrders: number
  customers: number
  inventoryItems: number
  employees: number
  stores: number
  apiCalls: number
  storageUsed: number // in MB
  featureUsage: Record<string, number>
}

export interface UsageLimits {
  maxWorkOrders: number | null
  maxCustomers: number | null
  maxInventoryItems: number | null
  maxEmployees: number | null
  maxStores: number | null
  maxApiCalls: number | null
  maxStorage: number | null // in MB
  allowedFeatures: string[]
}

export interface UsageReport {
  metrics: UsageMetrics
  limits: UsageLimits
  percentages: Record<string, number>
  overages: Record<string, number>
  warnings: string[]
  isOverLimit: boolean
}

export class UsageTrackingService {
  private supabase = createClient()

  /**
   * Track a specific usage event
   */
  async trackEvent(userId: string, eventType: string, metadata: Record<string, any> = {}, quantity = 1): Promise<void> {
    try {
      await this.supabase.from("usage_events").insert({
        user_id: userId,
        event_type: eventType,
        metadata,
        quantity,
        created_at: new Date().toISOString(),
      })

      // For high-volume events, we might want to batch these or use a queue
      await this.updateUsageSummary(userId, eventType, quantity)
    } catch (error) {
      console.error("Error tracking usage event:", error)
      // We don't want to break the app if usage tracking fails
      // But we might want to log this to a monitoring service
    }
  }

  /**
   * Update the usage summary for a user
   */
  private async updateUsageSummary(userId: string, eventType: string, quantity: number): Promise<void> {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1

    try {
      // Get current summary for this month
      const { data: existingSummary } = await this.supabase
        .from("usage_summaries")
        .select("*")
        .eq("user_id", userId)
        .eq("year", year)
        .eq("month", month)
        .single()

      if (existingSummary) {
        // Update existing summary
        const metrics = existingSummary.metrics || {}
        metrics[eventType] = (metrics[eventType] || 0) + quantity

        await this.supabase
          .from("usage_summaries")
          .update({
            metrics,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSummary.id)
      } else {
        // Create new summary
        const metrics: Record<string, number> = {}
        metrics[eventType] = quantity

        await this.supabase.from("usage_summaries").insert({
          user_id: userId,
          year,
          month,
          metrics,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error updating usage summary:", error)
    }
  }

  /**
   * Get the current usage metrics for a user
   */
  async getCurrentUsageMetrics(userId: string): Promise<UsageMetrics> {
    try {
      // Get counts from various tables
      const [
        { count: workOrderCount },
        { count: customerCount },
        { count: inventoryCount },
        { count: employeeCount },
        { count: storeCount },
        { data: apiUsage },
        { data: storageUsage },
        { data: featureUsage },
      ] = await Promise.all([
        this.supabase.from("work_orders").select("*", { count: "exact", head: true }).eq("user_id", userId),
        this.supabase.from("customers").select("*", { count: "exact", head: true }).eq("user_id", userId),
        this.supabase.from("inventory_items").select("*", { count: "exact", head: true }).eq("user_id", userId),
        this.supabase.from("employees").select("*", { count: "exact", head: true }).eq("user_id", userId),
        this.supabase.from("stores").select("*", { count: "exact", head: true }).eq("user_id", userId),
        this.supabase
          .from("usage_summaries")
          .select("metrics")
          .eq("user_id", userId)
          .eq("year", new Date().getFullYear())
          .eq("month", new Date().getMonth() + 1)
          .single(),
        this.supabase.from("storage_usage").select("total_size_mb").eq("user_id", userId).single(),
        this.supabase
          .from("feature_usage")
          .select("feature, count")
          .eq("user_id", userId)
          .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      ])

      // Extract API calls from usage summaries
      const apiCalls = apiUsage?.metrics?.api_calls || 0

      // Extract storage usage
      const storageUsed = storageUsage?.total_size_mb || 0

      // Build feature usage map
      const featureUsageMap: Record<string, number> = {}
      featureUsage?.forEach((item) => {
        featureUsageMap[item.feature] = item.count
      })

      return {
        workOrders: workOrderCount || 0,
        customers: customerCount || 0,
        inventoryItems: inventoryCount || 0,
        employees: employeeCount || 0,
        stores: storeCount || 0,
        apiCalls: apiCalls,
        storageUsed: storageUsed,
        featureUsage: featureUsageMap,
      }
    } catch (error) {
      console.error("Error getting usage metrics:", error)
      // Return zeros if we can't get the metrics
      return {
        workOrders: 0,
        customers: 0,
        inventoryItems: 0,
        employees: 0,
        stores: 0,
        apiCalls: 0,
        storageUsed: 0,
        featureUsage: {},
      }
    }
  }

  /**
   * Get the usage limits for a user's plan
   */
  async getUserPlanLimits(userId: string): Promise<UsageLimits> {
    try {
      // Get user's current plan
      const { data: user } = await this.supabase.from("users").select("plan").eq("id", userId).single()

      if (!user?.plan) {
        throw new Error("User plan not found")
      }

      // Get plan details
      const { data: planDetails } = await this.supabase.from("plans").select("*").eq("name", user.plan).single<Plan>()

      if (!planDetails) {
        throw new Error("Plan details not found")
      }

      // Get feature limits
      const { data: featureLimits } = await this.supabase
        .from("plan_feature_limits")
        .select("*")
        .eq("plan_name", user.plan)
        .single()

      // Default limits for all plans
      const limits: UsageLimits = {
        maxWorkOrders: featureLimits?.max_work_orders || null,
        maxCustomers: planDetails.max_customers,
        maxInventoryItems: planDetails.max_inventory_items,
        maxEmployees: planDetails.max_users,
        maxStores: planDetails.max_stores,
        maxApiCalls: featureLimits?.max_api_calls || null,
        maxStorage: featureLimits?.max_storage_mb || null,
        allowedFeatures: planDetails.features || [],
      }

      return limits
    } catch (error) {
      console.error("Error getting user plan limits:", error)
      // Return null limits if we can't get them (meaning unlimited)
      return {
        maxWorkOrders: null,
        maxCustomers: null,
        maxInventoryItems: null,
        maxEmployees: null,
        maxStores: null,
        maxApiCalls: null,
        maxStorage: null,
        allowedFeatures: [],
      }
    }
  }

  /**
   * Check if a user is over their plan limits
   */
  async getUserUsageReport(userId: string): Promise<UsageReport> {
    const metrics = await this.getCurrentUsageMetrics(userId)
    const limits = await this.getUserPlanLimits(userId)

    // Calculate percentages and overages
    const percentages: Record<string, number> = {}
    const overages: Record<string, number> = {}
    const warnings: string[] = []
    let isOverLimit = false

    // Check work orders
    if (limits.maxWorkOrders !== null) {
      percentages.workOrders = (metrics.workOrders / limits.maxWorkOrders) * 100
      if (metrics.workOrders > limits.maxWorkOrders) {
        overages.workOrders = metrics.workOrders - limits.maxWorkOrders
        warnings.push(`You've exceeded your work order limit by ${overages.workOrders} orders.`)
        isOverLimit = true
      } else if (percentages.workOrders > 80) {
        warnings.push(`You're approaching your work order limit (${percentages.workOrders.toFixed(1)}%).`)
      }
    }

    // Check customers
    if (limits.maxCustomers !== null) {
      percentages.customers = (metrics.customers / limits.maxCustomers) * 100
      if (metrics.customers > limits.maxCustomers) {
        overages.customers = metrics.customers - limits.maxCustomers
        warnings.push(`You've exceeded your customer limit by ${overages.customers} customers.`)
        isOverLimit = true
      } else if (percentages.customers > 80) {
        warnings.push(`You're approaching your customer limit (${percentages.customers.toFixed(1)}%).`)
      }
    }

    // Check inventory items
    if (limits.maxInventoryItems !== null) {
      percentages.inventoryItems = (metrics.inventoryItems / limits.maxInventoryItems) * 100
      if (metrics.inventoryItems > limits.maxInventoryItems) {
        overages.inventoryItems = metrics.inventoryItems - limits.maxInventoryItems
        warnings.push(`You've exceeded your inventory item limit by ${overages.inventoryItems} items.`)
        isOverLimit = true
      } else if (percentages.inventoryItems > 80) {
        warnings.push(`You're approaching your inventory item limit (${percentages.inventoryItems.toFixed(1)}%).`)
      }
    }

    // Check employees
    if (limits.maxEmployees !== null) {
      percentages.employees = (metrics.employees / limits.maxEmployees) * 100
      if (metrics.employees > limits.maxEmployees) {
        overages.employees = metrics.employees - limits.maxEmployees
        warnings.push(`You've exceeded your employee limit by ${overages.employees} employees.`)
        isOverLimit = true
      } else if (percentages.employees > 80) {
        warnings.push(`You're approaching your employee limit (${percentages.employees.toFixed(1)}%).`)
      }
    }

    // Check stores
    if (limits.maxStores !== null) {
      percentages.stores = (metrics.stores / limits.maxStores) * 100
      if (metrics.stores > limits.maxStores) {
        overages.stores = metrics.stores - limits.maxStores
        warnings.push(`You've exceeded your store limit by ${overages.stores} stores.`)
        isOverLimit = true
      } else if (percentages.stores > 80) {
        warnings.push(`You're approaching your store limit (${percentages.stores.toFixed(1)}%).`)
      }
    }

    // Check API calls
    if (limits.maxApiCalls !== null) {
      percentages.apiCalls = (metrics.apiCalls / limits.maxApiCalls) * 100
      if (metrics.apiCalls > limits.maxApiCalls) {
        overages.apiCalls = metrics.apiCalls - limits.maxApiCalls
        warnings.push(`You've exceeded your API call limit by ${overages.apiCalls} calls.`)
        isOverLimit = true
      } else if (percentages.apiCalls > 80) {
        warnings.push(`You're approaching your API call limit (${percentages.apiCalls.toFixed(1)}%).`)
      }
    }

    // Check storage
    if (limits.maxStorage !== null) {
      percentages.storage = (metrics.storageUsed / limits.maxStorage) * 100
      if (metrics.storageUsed > limits.maxStorage) {
        overages.storage = metrics.storageUsed - limits.maxStorage
        warnings.push(`You've exceeded your storage limit by ${overages.storage.toFixed(1)} MB.`)
        isOverLimit = true
      } else if (percentages.storage > 80) {
        warnings.push(`You're approaching your storage limit (${percentages.storage.toFixed(1)}%).`)
      }
    }

    return {
      metrics,
      limits,
      percentages,
      overages,
      warnings,
      isOverLimit,
    }
  }

  /**
   * Report usage to Stripe for metered billing
   */
  async reportUsageToStripe(userId: string): Promise<void> {
    try {
      // Get user's Stripe subscription
      const { data: user } = await this.supabase
        .from("users")
        .select("stripe_subscription_id")
        .eq("id", userId)
        .single()

      if (!user?.stripe_subscription_id) {
        // User doesn't have a Stripe subscription
        return
      }

      // Get usage metrics
      const metrics = await this.getCurrentUsageMetrics(userId)

      // Get subscription items for metered billing
      const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id)

      // Find subscription items for metered components
      for (const item of subscription.items.data) {
        const itemId = item.id
        const priceId = item.price.id

        // Determine which metric to report based on the price ID
        // This requires setting up your Stripe prices with specific metadata
        // to identify which metric they correspond to
        let quantity = 0

        if (item.price.metadata.metric === "api_calls") {
          quantity = metrics.apiCalls
        } else if (item.price.metadata.metric === "storage_mb") {
          quantity = metrics.storageUsed
        }
        // Add other metrics as needed

        if (quantity > 0) {
          // Report usage to Stripe
          await stripe.subscriptionItems.createUsageRecord(itemId, {
            quantity,
            timestamp: "now",
            action: "increment",
          })
        }
      }
    } catch (error) {
      console.error("Error reporting usage to Stripe:", error)
    }
  }

  /**
   * Check if a feature is available for a user's plan
   */
  async isFeatureAvailable(userId: string, featureName: string): Promise<boolean> {
    try {
      const limits = await this.getUserPlanLimits(userId)
      return limits.allowedFeatures.includes(featureName)
    } catch (error) {
      console.error("Error checking feature availability:", error)
      // Default to false if we can't check
      return false
    }
  }

  /**
   * Record feature usage
   */
  async recordFeatureUsage(userId: string, featureName: string): Promise<void> {
    await this.trackEvent(userId, `feature_${featureName}`, {}, 1)
  }

  /**
   * Get recommended plan based on current usage
   */
  async getRecommendedPlan(userId: string): Promise<string | null> {
    try {
      const usageReport = await this.getUserUsageReport(userId)

      // Get all available plans
      const { data: plans } = await this.supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("price_monthly", { ascending: true })

      if (!plans || plans.length === 0) {
        return null
      }

      // Find the first plan that accommodates the user's current usage
      for (const plan of plans) {
        let planFits = true

        if (plan.max_customers !== null && usageReport.metrics.customers > plan.max_customers) {
          planFits = false
        }

        if (plan.max_inventory_items !== null && usageReport.metrics.inventoryItems > plan.max_inventory_items) {
          planFits = false
        }

        if (plan.max_users !== null && usageReport.metrics.employees > plan.max_users) {
          planFits = false
        }

        if (plan.max_stores !== null && usageReport.metrics.stores > plan.max_stores) {
          planFits = false
        }

        if (planFits) {
          return plan.name
        }
      }

      // If no plan fits, recommend the highest tier
      return plans[plans.length - 1].name
    } catch (error) {
      console.error("Error getting recommended plan:", error)
      return null
    }
  }
}

export const usageTrackingService = new UsageTrackingService()

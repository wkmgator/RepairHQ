import { createClient } from "@/lib/supabase"

export interface Location {
  id: string
  user_id: string
  name: string
  type: "store" | "warehouse" | "franchise" | "kiosk"
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  phone: string
  email: string
  manager_id?: string
  is_active: boolean
  is_default: boolean
  timezone: string
  business_hours: BusinessHours
  settings: LocationSettings
  coordinates?: { lat: number; lng: number }
  franchise_info?: FranchiseInfo
  created_at: string
  updated_at: string
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean }
  tuesday: { open: string; close: string; closed: boolean }
  wednesday: { open: string; close: string; closed: boolean }
  thursday: { open: string; close: string; closed: boolean }
  friday: { open: string; close: string; closed: boolean }
  saturday: { open: string; close: string; closed: boolean }
  sunday: { open: string; close: string; closed: boolean }
}

export interface LocationSettings {
  auto_assign_tickets: boolean
  inventory_alerts: boolean
  low_stock_threshold: number
  max_capacity: number
  service_radius: number
  accepts_walk_ins: boolean
  online_booking_enabled: boolean
  payment_methods: string[]
  tax_rate: number
  currency: string
}

export interface FranchiseInfo {
  franchise_id: string
  franchisee_name: string
  franchisee_email: string
  franchisee_phone: string
  territory: string
  royalty_rate: number
  marketing_fee_rate: number
  contract_start_date: string
  contract_end_date: string
  status: "active" | "pending" | "suspended" | "terminated"
  performance_metrics: FranchiseMetrics
}

export interface FranchiseMetrics {
  monthly_revenue: number
  monthly_target: number
  customer_satisfaction: number
  compliance_score: number
  brand_standards_score: number
  training_completion: number
}

export interface InventoryTransfer {
  id: string
  from_location_id: string
  to_location_id: string
  requested_by: string
  approved_by?: string
  status: "pending" | "approved" | "in_transit" | "completed" | "cancelled"
  items: TransferItem[]
  notes?: string
  tracking_number?: string
  estimated_arrival?: string
  actual_arrival?: string
  created_at: string
  updated_at: string
}

export interface TransferItem {
  inventory_id: string
  name: string
  sku: string
  quantity_requested: number
  quantity_approved?: number
  quantity_shipped?: number
  quantity_received?: number
  unit_cost: number
  notes?: string
}

export interface LocationPermission {
  user_id: string
  location_id: string
  role: "manager" | "employee" | "viewer"
  permissions: string[]
  granted_by: string
  granted_at: string
}

export interface TerritoryMap {
  id: string
  name: string
  boundaries: GeoPolygon
  assigned_location_id?: string
  population: number
  market_potential: number
  competition_level: "low" | "medium" | "high"
  demographics: Demographics
}

export interface GeoPolygon {
  type: "Polygon"
  coordinates: number[][][]
}

export interface Demographics {
  median_income: number
  age_groups: Record<string, number>
  device_ownership: Record<string, number>
  market_size: number
}

export class LocationManagementService {
  private supabase = createClient()

  // Location CRUD operations
  async createLocation(locationData: Partial<Location>): Promise<Location> {
    const { data, error } = await this.supabase
      .from("locations")
      .insert({
        ...locationData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateLocation(locationId: string, updates: Partial<Location>): Promise<Location> {
    const { data, error } = await this.supabase
      .from("locations")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", locationId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteLocation(locationId: string): Promise<void> {
    const { error } = await this.supabase.from("locations").delete().eq("id", locationId)
    if (error) throw error
  }

  async getLocations(userId: string): Promise<Location[]> {
    const { data, error } = await this.supabase
      .from("locations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  async getLocationById(locationId: string): Promise<Location | null> {
    const { data, error } = await this.supabase.from("locations").select("*").eq("id", locationId).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  }

  // Inventory Transfer Management
  async createInventoryTransfer(transferData: Partial<InventoryTransfer>): Promise<InventoryTransfer> {
    const { data, error } = await this.supabase
      .from("inventory_transfers")
      .insert({
        ...transferData,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await this.createTransferAuditLog(data.id, "created", transferData.requested_by!)

    return data
  }

  async approveInventoryTransfer(
    transferId: string,
    approvedBy: string,
    approvedItems: TransferItem[],
  ): Promise<InventoryTransfer> {
    const { data, error } = await this.supabase
      .from("inventory_transfers")
      .update({
        status: "approved",
        approved_by: approvedBy,
        items: approvedItems,
        updated_at: new Date().toISOString(),
      })
      .eq("id", transferId)
      .select()
      .single()

    if (error) throw error

    // Update inventory quantities
    await this.updateInventoryForTransfer(data, "approved")

    // Create audit log
    await this.createTransferAuditLog(transferId, "approved", approvedBy)

    return data
  }

  async shipInventoryTransfer(
    transferId: string,
    trackingNumber: string,
    estimatedArrival: string,
  ): Promise<InventoryTransfer> {
    const { data, error } = await this.supabase
      .from("inventory_transfers")
      .update({
        status: "in_transit",
        tracking_number: trackingNumber,
        estimated_arrival: estimatedArrival,
        updated_at: new Date().toISOString(),
      })
      .eq("id", transferId)
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await this.createTransferAuditLog(transferId, "shipped", "system")

    return data
  }

  async completeInventoryTransfer(transferId: string, receivedItems: TransferItem[]): Promise<InventoryTransfer> {
    const { data, error } = await this.supabase
      .from("inventory_transfers")
      .update({
        status: "completed",
        items: receivedItems,
        actual_arrival: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", transferId)
      .select()
      .single()

    if (error) throw error

    // Update inventory quantities
    await this.updateInventoryForTransfer(data, "completed")

    // Create audit log
    await this.createTransferAuditLog(transferId, "completed", "system")

    return data
  }

  async getInventoryTransfers(locationId?: string): Promise<InventoryTransfer[]> {
    let query = this.supabase.from("inventory_transfers").select("*")

    if (locationId) {
      query = query.or(`from_location_id.eq.${locationId},to_location_id.eq.${locationId}`)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  }

  // Location Permissions Management
  async grantLocationPermission(permission: Omit<LocationPermission, "granted_at">): Promise<LocationPermission> {
    const { data, error } = await this.supabase
      .from("location_permissions")
      .insert({
        ...permission,
        granted_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async revokeLocationPermission(userId: string, locationId: string): Promise<void> {
    const { error } = await this.supabase
      .from("location_permissions")
      .delete()
      .eq("user_id", userId)
      .eq("location_id", locationId)

    if (error) throw error
  }

  async getUserLocationPermissions(userId: string): Promise<LocationPermission[]> {
    const { data, error } = await this.supabase.from("location_permissions").select("*").eq("user_id", userId)

    if (error) throw error
    return data || []
  }

  async getLocationPermissions(locationId: string): Promise<LocationPermission[]> {
    const { data, error } = await this.supabase.from("location_permissions").select("*").eq("location_id", locationId)

    if (error) throw error
    return data || []
  }

  // Location Analytics
  async getLocationAnalytics(locationId: string, dateRange: { start: Date; end: Date }) {
    const [revenue, tickets, customers, inventory] = await Promise.all([
      this.getLocationRevenue(locationId, dateRange),
      this.getLocationTickets(locationId, dateRange),
      this.getLocationCustomers(locationId, dateRange),
      this.getLocationInventory(locationId),
    ])

    return {
      revenue,
      tickets,
      customers,
      inventory,
    }
  }

  private async getLocationRevenue(locationId: string, dateRange: { start: Date; end: Date }) {
    const { data, error } = await this.supabase
      .from("invoices")
      .select("total_amount, paid_date")
      .eq("location_id", locationId)
      .eq("status", "paid")
      .gte("paid_date", dateRange.start.toISOString())
      .lte("paid_date", dateRange.end.toISOString())

    if (error) throw error

    const totalRevenue = data?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0
    const transactionCount = data?.length || 0

    return {
      total: totalRevenue,
      transactions: transactionCount,
      average: transactionCount > 0 ? totalRevenue / transactionCount : 0,
    }
  }

  private async getLocationTickets(locationId: string, dateRange: { start: Date; end: Date }) {
    const { data, error } = await this.supabase
      .from("work_orders")
      .select("status, created_at, actual_completion")
      .eq("location_id", locationId)
      .gte("created_at", dateRange.start.toISOString())
      .lte("created_at", dateRange.end.toISOString())

    if (error) throw error

    const totalTickets = data?.length || 0
    const completedTickets = data?.filter((ticket) => ticket.status === "completed").length || 0
    const avgResolutionTime = this.calculateAverageResolutionTime(data || [])

    return {
      total: totalTickets,
      completed: completedTickets,
      completionRate: totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0,
      averageResolutionTime: avgResolutionTime,
    }
  }

  private async getLocationCustomers(locationId: string, dateRange: { start: Date; end: Date }) {
    const { data, error } = await this.supabase
      .from("customers")
      .select("created_at")
      .eq("location_id", locationId)
      .gte("created_at", dateRange.start.toISOString())
      .lte("created_at", dateRange.end.toISOString())

    if (error) throw error

    return {
      new: data?.length || 0,
    }
  }

  private async getLocationInventory(locationId: string) {
    const { data, error } = await this.supabase
      .from("inventory_items")
      .select("quantity_in_stock, min_stock_level, unit_cost")
      .eq("location_id", locationId)
      .eq("is_active", true)

    if (error) throw error

    const totalValue = data?.reduce((sum, item) => sum + (item.quantity_in_stock || 0) * (item.unit_cost || 0), 0) || 0
    const lowStockItems =
      data?.filter((item) => (item.quantity_in_stock || 0) <= (item.min_stock_level || 0)).length || 0

    return {
      totalValue,
      lowStockItems,
      totalItems: data?.length || 0,
    }
  }

  // Territory Management
  async createTerritory(territory: Omit<TerritoryMap, "id">): Promise<TerritoryMap> {
    const { data, error } = await this.supabase.from("territories").insert(territory).select().single()

    if (error) throw error
    return data
  }

  async assignTerritoryToLocation(territoryId: string, locationId: string): Promise<void> {
    const { error } = await this.supabase
      .from("territories")
      .update({ assigned_location_id: locationId })
      .eq("id", territoryId)

    if (error) throw error
  }

  async getTerritories(): Promise<TerritoryMap[]> {
    const { data, error } = await this.supabase.from("territories").select("*")

    if (error) throw error
    return data || []
  }

  async getUnassignedTerritories(): Promise<TerritoryMap[]> {
    const { data, error } = await this.supabase.from("territories").select("*").is("assigned_location_id", null)

    if (error) throw error
    return data || []
  }

  // Franchise Management
  async createFranchise(franchiseData: Partial<Location>): Promise<Location> {
    const location = await this.createLocation({
      ...franchiseData,
      type: "franchise",
    })

    // Create franchise onboarding workflow
    await this.createFranchiseOnboardingWorkflow(location.id)

    return location
  }

  async calculateRoyalties(franchiseId: string, month: string): Promise<RoyaltyCalculation> {
    const location = await this.getLocationById(franchiseId)
    if (!location || !location.franchise_info) {
      throw new Error("Franchise not found")
    }

    const startDate = new Date(`${month}-01`)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)

    const revenue = await this.getLocationRevenue(franchiseId, { start: startDate, end: endDate })

    const royaltyAmount = revenue.total * (location.franchise_info.royalty_rate / 100)
    const marketingFee = revenue.total * (location.franchise_info.marketing_fee_rate / 100)

    return {
      franchiseId,
      month,
      grossRevenue: revenue.total,
      royaltyRate: location.franchise_info.royalty_rate,
      royaltyAmount,
      marketingFeeRate: location.franchise_info.marketing_fee_rate,
      marketingFee,
      totalDue: royaltyAmount + marketingFee,
      dueDate: new Date(endDate.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days after month end
    }
  }

  async getFranchisePerformance(franchiseId: string): Promise<FranchisePerformance> {
    const location = await this.getLocationById(franchiseId)
    if (!location || !location.franchise_info) {
      throw new Error("Franchise not found")
    }

    const currentMonth = new Date()
    const analytics = await this.getLocationAnalytics(franchiseId, {
      start: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
      end: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
    })

    return {
      franchiseId,
      franchiseName: location.name,
      monthlyRevenue: analytics.revenue.total,
      monthlyTarget: location.franchise_info.performance_metrics.monthly_target,
      customerSatisfaction: location.franchise_info.performance_metrics.customer_satisfaction,
      complianceScore: location.franchise_info.performance_metrics.compliance_score,
      brandStandardsScore: location.franchise_info.performance_metrics.brand_standards_score,
      trainingCompletion: location.franchise_info.performance_metrics.training_completion,
      status: location.franchise_info.status,
    }
  }

  // Helper methods
  private async updateInventoryForTransfer(transfer: InventoryTransfer, action: "approved" | "completed") {
    for (const item of transfer.items) {
      if (action === "approved") {
        // Reduce inventory at source location
        await this.supabase
          .from("inventory_items")
          .update({
            quantity_in_stock: this.supabase.raw(
              `quantity_in_stock - ${item.quantity_approved || item.quantity_requested}`,
            ),
          })
          .eq("id", item.inventory_id)
          .eq("location_id", transfer.from_location_id)
      } else if (action === "completed") {
        // Add inventory at destination location
        await this.supabase
          .from("inventory_items")
          .update({
            quantity_in_stock: this.supabase.raw(
              `quantity_in_stock + ${item.quantity_received || item.quantity_approved || item.quantity_requested}`,
            ),
          })
          .eq("id", item.inventory_id)
          .eq("location_id", transfer.to_location_id)
      }
    }
  }

  private async createTransferAuditLog(transferId: string, action: string, userId: string) {
    await this.supabase.from("transfer_audit_logs").insert({
      transfer_id: transferId,
      action,
      user_id: userId,
      timestamp: new Date().toISOString(),
    })
  }

  private calculateAverageResolutionTime(tickets: any[]): number {
    const completedTickets = tickets.filter((t) => t.status === "completed" && t.actual_completion)

    if (completedTickets.length === 0) return 0

    const totalTime = completedTickets.reduce((sum, ticket) => {
      const created = new Date(ticket.created_at)
      const completed = new Date(ticket.actual_completion)
      return sum + (completed.getTime() - created.getTime())
    }, 0)

    return totalTime / completedTickets.length / (1000 * 60 * 60) // Convert to hours
  }

  private async createFranchiseOnboardingWorkflow(franchiseId: string) {
    const onboardingSteps = [
      { step: "contract_signed", status: "pending", order: 1 },
      { step: "initial_training", status: "pending", order: 2 },
      { step: "location_setup", status: "pending", order: 3 },
      { step: "system_training", status: "pending", order: 4 },
      { step: "grand_opening", status: "pending", order: 5 },
    ]

    for (const step of onboardingSteps) {
      await this.supabase.from("franchise_onboarding").insert({
        franchise_id: franchiseId,
        ...step,
        created_at: new Date().toISOString(),
      })
    }
  }
}

export interface RoyaltyCalculation {
  franchiseId: string
  month: string
  grossRevenue: number
  royaltyRate: number
  royaltyAmount: number
  marketingFeeRate: number
  marketingFee: number
  totalDue: number
  dueDate: Date
}

export interface FranchisePerformance {
  franchiseId: string
  franchiseName: string
  monthlyRevenue: number
  monthlyTarget: number
  customerSatisfaction: number
  complianceScore: number
  brandStandardsScore: number
  trainingCompletion: number
  status: string
}

export const locationManagementService = new LocationManagementService()

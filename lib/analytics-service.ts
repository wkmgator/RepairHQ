import { createClient } from "@/lib/supabase"

export interface AnalyticsData {
  revenue: RevenueAnalytics
  technicians: TechnicianAnalytics
  inventory: InventoryAnalytics
  customers: CustomerAnalytics
  tickets: TicketAnalytics
  locations: LocationAnalytics
}

export interface RevenueAnalytics {
  totalRevenue: number
  monthlyRevenue: Array<{ month: string; revenue: number; growth: number }>
  revenueByService: Array<{ service: string; revenue: number; percentage: number }>
  revenueByLocation: Array<{ location: string; revenue: number; percentage: number }>
  averageOrderValue: number
  profitMargin: number
  yearOverYearGrowth: number
  quarterlyTrends: Array<{ quarter: string; revenue: number; growth: number }>
}

export interface TechnicianAnalytics {
  totalTechnicians: number
  averageTicketsPerTech: number
  topPerformers: Array<{
    id: string
    name: string
    ticketsCompleted: number
    averageRating: number
    revenue: number
    efficiency: number
  }>
  productivityTrends: Array<{ date: string; productivity: number }>
  skillAnalysis: Array<{ skill: string; demand: number; availability: number }>
}

export interface InventoryAnalytics {
  totalValue: number
  turnoverRate: number
  lowStockItems: number
  topSellingItems: Array<{ item: string; quantity: number; revenue: number }>
  slowMovingItems: Array<{ item: string; daysInStock: number; value: number }>
  forecastedDemand: Array<{ item: string; predictedDemand: number; confidence: number }>
  supplierPerformance: Array<{ supplier: string; deliveryTime: number; quality: number }>
}

export interface CustomerAnalytics {
  totalCustomers: number
  newCustomers: number
  retentionRate: number
  customerLifetimeValue: number
  satisfactionScore: number
  topCustomers: Array<{ name: string; totalSpent: number; visits: number }>
  churnRisk: Array<{ customerId: string; name: string; riskScore: number }>
  segmentation: Array<{ segment: string; count: number; value: number }>
}

export interface TicketAnalytics {
  totalTickets: number
  completionRate: number
  averageResolutionTime: number
  firstTimeFixRate: number
  ticketsByStatus: Array<{ status: string; count: number; percentage: number }>
  ticketsByPriority: Array<{ priority: string; count: number; avgTime: number }>
  seasonalTrends: Array<{ month: string; tickets: number; trend: number }>
}

export interface LocationAnalytics {
  totalLocations: number
  performanceByLocation: Array<{
    location: string
    revenue: number
    tickets: number
    efficiency: number
    customerSatisfaction: number
  }>
  capacityUtilization: Array<{ location: string; utilization: number }>
}

export class AnalyticsService {
  private supabase = createClient()

  async getAnalyticsData(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<AnalyticsData> {
    const [revenue, technicians, inventory, customers, tickets, locations] = await Promise.all([
      this.getRevenueAnalytics(userId, dateRange, locationId),
      this.getTechnicianAnalytics(userId, dateRange, locationId),
      this.getInventoryAnalytics(userId, dateRange, locationId),
      this.getCustomerAnalytics(userId, dateRange, locationId),
      this.getTicketAnalytics(userId, dateRange, locationId),
      this.getLocationAnalytics(userId, dateRange),
    ])

    return {
      revenue,
      technicians,
      inventory,
      customers,
      tickets,
      locations,
    }
  }

  private async getRevenueAnalytics(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<RevenueAnalytics> {
    // Get total revenue
    const { data: invoices } = await this.supabase
      .from("invoices")
      .select("total_amount, paid_date, created_at")
      .eq("user_id", userId)
      .eq("status", "paid")
      .gte("paid_date", dateRange.start.toISOString())
      .lte("paid_date", dateRange.end.toISOString())

    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

    // Get monthly revenue trends
    const monthlyRevenue = await this.calculateMonthlyRevenue(userId, dateRange, locationId)

    // Get revenue by service type
    const revenueByService = await this.getRevenueByService(userId, dateRange, locationId)

    // Get revenue by location
    const revenueByLocation = await this.getRevenueByLocation(userId, dateRange)

    // Calculate metrics
    const averageOrderValue = invoices?.length ? totalRevenue / invoices.length : 0
    const profitMargin = await this.calculateProfitMargin(userId, dateRange, locationId)
    const yearOverYearGrowth = await this.calculateYearOverYearGrowth(userId, dateRange, locationId)
    const quarterlyTrends = await this.getQuarterlyTrends(userId, dateRange, locationId)

    return {
      totalRevenue,
      monthlyRevenue,
      revenueByService,
      revenueByLocation,
      averageOrderValue,
      profitMargin,
      yearOverYearGrowth,
      quarterlyTrends,
    }
  }

  private async getTechnicianAnalytics(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<TechnicianAnalytics> {
    // Get technician data
    const { data: employees } = await this.supabase
      .from("employees")
      .select("*")
      .eq("user_id", userId)
      .eq("role", "technician")
      .eq("is_active", true)

    const totalTechnicians = employees?.length || 0

    // Get ticket assignments and performance
    const topPerformers = await this.getTopPerformers(userId, dateRange, locationId)
    const averageTicketsPerTech =
      topPerformers.reduce((sum, tech) => sum + tech.ticketsCompleted, 0) / totalTechnicians || 0

    const productivityTrends = await this.getProductivityTrends(userId, dateRange, locationId)
    const skillAnalysis = await this.getSkillAnalysis(userId, dateRange, locationId)

    return {
      totalTechnicians,
      averageTicketsPerTech,
      topPerformers,
      productivityTrends,
      skillAnalysis,
    }
  }

  private async getInventoryAnalytics(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<InventoryAnalytics> {
    // Get inventory data
    const { data: inventory } = await this.supabase
      .from("inventory_items")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)

    const totalValue =
      inventory?.reduce((sum, item) => sum + (item.quantity_in_stock || 0) * (item.unit_cost || 0), 0) || 0

    const lowStockItems =
      inventory?.filter((item) => (item.quantity_in_stock || 0) <= (item.min_stock_level || 0)).length || 0

    const turnoverRate = await this.calculateInventoryTurnover(userId, dateRange, locationId)
    const topSellingItems = await this.getTopSellingItems(userId, dateRange, locationId)
    const slowMovingItems = await this.getSlowMovingItems(userId, dateRange, locationId)
    const forecastedDemand = await this.getForecastedDemand(userId, dateRange, locationId)
    const supplierPerformance = await this.getSupplierPerformance(userId, dateRange, locationId)

    return {
      totalValue,
      turnoverRate,
      lowStockItems,
      topSellingItems,
      slowMovingItems,
      forecastedDemand,
      supplierPerformance,
    }
  }

  private async getCustomerAnalytics(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<CustomerAnalytics> {
    // Get customer data
    const { data: customers } = await this.supabase.from("customers").select("*").eq("user_id", userId)

    const totalCustomers = customers?.length || 0

    const newCustomers =
      customers?.filter((customer) => {
        const createdAt = new Date(customer.created_at)
        return createdAt >= dateRange.start && createdAt <= dateRange.end
      }).length || 0

    const retentionRate = await this.calculateRetentionRate(userId, dateRange, locationId)
    const customerLifetimeValue = await this.calculateCustomerLifetimeValue(userId, dateRange, locationId)
    const satisfactionScore = await this.calculateSatisfactionScore(userId, dateRange, locationId)
    const topCustomers = await this.getTopCustomers(userId, dateRange, locationId)
    const churnRisk = await this.getChurnRiskCustomers(userId, dateRange, locationId)
    const segmentation = await this.getCustomerSegmentation(userId, dateRange, locationId)

    return {
      totalCustomers,
      newCustomers,
      retentionRate,
      customerLifetimeValue,
      satisfactionScore,
      topCustomers,
      churnRisk,
      segmentation,
    }
  }

  private async getTicketAnalytics(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<TicketAnalytics> {
    // Get ticket data
    const { data: tickets } = await this.supabase
      .from("work_orders")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", dateRange.start.toISOString())
      .lte("created_at", dateRange.end.toISOString())

    const totalTickets = tickets?.length || 0
    const completedTickets = tickets?.filter((t) => t.status === "completed").length || 0
    const completionRate = totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0

    const averageResolutionTime = await this.calculateAverageResolutionTime(userId, dateRange, locationId)
    const firstTimeFixRate = await this.calculateFirstTimeFixRate(userId, dateRange, locationId)
    const ticketsByStatus = await this.getTicketsByStatus(userId, dateRange, locationId)
    const ticketsByPriority = await this.getTicketsByPriority(userId, dateRange, locationId)
    const seasonalTrends = await this.getSeasonalTrends(userId, dateRange, locationId)

    return {
      totalTickets,
      completionRate,
      averageResolutionTime,
      firstTimeFixRate,
      ticketsByStatus,
      ticketsByPriority,
      seasonalTrends,
    }
  }

  private async getLocationAnalytics(
    userId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<LocationAnalytics> {
    // Get location data
    const { data: locations } = await this.supabase.from("stores").select("*").eq("user_id", userId)

    const totalLocations = locations?.length || 0

    const performanceByLocation = await Promise.all(
      locations?.map(async (location) => {
        const revenue = await this.getLocationRevenue(userId, location.id, dateRange)
        const tickets = await this.getLocationTickets(userId, location.id, dateRange)
        const efficiency = await this.getLocationEfficiency(userId, location.id, dateRange)
        const customerSatisfaction = await this.getLocationSatisfaction(userId, location.id, dateRange)

        return {
          location: location.name,
          revenue,
          tickets,
          efficiency,
          customerSatisfaction,
        }
      }) || [],
    )

    const capacityUtilization = await this.getCapacityUtilization(userId, dateRange)

    return {
      totalLocations,
      performanceByLocation,
      capacityUtilization,
    }
  }

  // Helper methods for calculations
  private async calculateMonthlyRevenue(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    // Implementation for monthly revenue calculation
    const months = []
    const current = new Date(dateRange.start)

    while (current <= dateRange.end) {
      const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)

      const { data: monthlyInvoices } = await this.supabase
        .from("invoices")
        .select("total_amount")
        .eq("user_id", userId)
        .eq("status", "paid")
        .gte("paid_date", monthStart.toISOString())
        .lte("paid_date", monthEnd.toISOString())

      const revenue = monthlyInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

      months.push({
        month: current.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        revenue,
        growth: 0, // Calculate growth compared to previous month
      })

      current.setMonth(current.getMonth() + 1)
    }

    return months
  }

  private async getRevenueByService(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    // Implementation for revenue by service type
    return [
      { service: "Screen Repair", revenue: 15000, percentage: 35 },
      { service: "Battery Replacement", revenue: 8000, percentage: 20 },
      { service: "Water Damage", revenue: 12000, percentage: 25 },
      { service: "Software Issues", revenue: 6000, percentage: 15 },
      { service: "Other", revenue: 2000, percentage: 5 },
    ]
  }

  private async getRevenueByLocation(userId: string, dateRange: { start: Date; end: Date }) {
    // Implementation for revenue by location
    return [
      { location: "Main Store", revenue: 25000, percentage: 60 },
      { location: "Downtown Branch", revenue: 12000, percentage: 30 },
      { location: "Mall Kiosk", revenue: 4000, percentage: 10 },
    ]
  }

  // Additional helper methods would be implemented here...
  private async calculateProfitMargin(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<number> {
    return 68.5 // Mock data
  }

  private async calculateYearOverYearGrowth(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<number> {
    return 23.5 // Mock data
  }

  private async getQuarterlyTrends(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { quarter: "Q1 2024", revenue: 45000, growth: 15.2 },
      { quarter: "Q2 2024", revenue: 52000, growth: 18.5 },
      { quarter: "Q3 2024", revenue: 48000, growth: 12.1 },
      { quarter: "Q4 2024", revenue: 58000, growth: 25.3 },
    ]
  }

  private async getTopPerformers(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { id: "1", name: "Mike Johnson", ticketsCompleted: 45, averageRating: 4.8, revenue: 12000, efficiency: 95 },
      { id: "2", name: "Sarah Chen", ticketsCompleted: 42, averageRating: 4.9, revenue: 11500, efficiency: 92 },
      { id: "3", name: "Alex Rodriguez", ticketsCompleted: 38, averageRating: 4.7, revenue: 10200, efficiency: 88 },
    ]
  }

  private async getProductivityTrends(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { date: "2024-01", productivity: 85 },
      { date: "2024-02", productivity: 88 },
      { date: "2024-03", productivity: 92 },
      { date: "2024-04", productivity: 90 },
    ]
  }

  private async getSkillAnalysis(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { skill: "Screen Repair", demand: 85, availability: 90 },
      { skill: "Water Damage", demand: 65, availability: 70 },
      { skill: "Motherboard Repair", demand: 45, availability: 40 },
    ]
  }

  // Continue with other helper methods...
  private async calculateInventoryTurnover(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<number> {
    return 4.2 // Mock data
  }

  private async getTopSellingItems(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { item: "iPhone 14 Screen", quantity: 125, revenue: 15000 },
      { item: "Samsung Galaxy Battery", quantity: 98, revenue: 8500 },
      { item: "iPad Pro Screen", quantity: 67, revenue: 12000 },
    ]
  }

  private async getSlowMovingItems(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { item: "iPhone 6 Battery", daysInStock: 180, value: 450 },
      { item: "Old Android Screens", daysInStock: 220, value: 800 },
    ]
  }

  private async getForecastedDemand(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { item: "iPhone 15 Screen", predictedDemand: 150, confidence: 85 },
      { item: "Samsung S24 Battery", predictedDemand: 120, confidence: 78 },
    ]
  }

  private async getSupplierPerformance(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { supplier: "TechParts Inc", deliveryTime: 3.2, quality: 95 },
      { supplier: "Mobile Supply Co", deliveryTime: 4.1, quality: 88 },
    ]
  }

  private async calculateRetentionRate(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<number> {
    return 87.3 // Mock data
  }

  private async calculateCustomerLifetimeValue(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<number> {
    return 450 // Mock data
  }

  private async calculateSatisfactionScore(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<number> {
    return 4.6 // Mock data
  }

  private async getTopCustomers(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { name: "John Smith", totalSpent: 2500, visits: 8 },
      { name: "Mary Johnson", totalSpent: 1800, visits: 6 },
      { name: "David Wilson", totalSpent: 1500, visits: 5 },
    ]
  }

  private async getChurnRiskCustomers(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { customerId: "1", name: "Alice Brown", riskScore: 85 },
      { customerId: "2", name: "Bob Davis", riskScore: 72 },
    ]
  }

  private async getCustomerSegmentation(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { segment: "High Value", count: 45, value: 25000 },
      { segment: "Regular", count: 180, value: 35000 },
      { segment: "Occasional", count: 320, value: 15000 },
    ]
  }

  private async calculateAverageResolutionTime(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<number> {
    return 2.4 // Mock data in hours
  }

  private async calculateFirstTimeFixRate(
    userId: string,
    dateRange: { start: Date; end: Date },
    locationId?: string,
  ): Promise<number> {
    return 92 // Mock data
  }

  private async getTicketsByStatus(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { status: "Completed", count: 145, percentage: 65 },
      { status: "In Progress", count: 45, percentage: 20 },
      { status: "Pending", count: 25, percentage: 11 },
      { status: "Cancelled", count: 8, percentage: 4 },
    ]
  }

  private async getTicketsByPriority(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { priority: "High", count: 35, avgTime: 1.2 },
      { priority: "Medium", count: 120, avgTime: 2.4 },
      { priority: "Low", count: 68, avgTime: 4.8 },
    ]
  }

  private async getSeasonalTrends(userId: string, dateRange: { start: Date; end: Date }, locationId?: string) {
    return [
      { month: "Jan", tickets: 180, trend: 5 },
      { month: "Feb", tickets: 165, trend: -8 },
      { month: "Mar", tickets: 195, trend: 18 },
      { month: "Apr", tickets: 210, trend: 8 },
    ]
  }

  private async getLocationRevenue(
    userId: string,
    locationId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<number> {
    return 25000 // Mock data
  }

  private async getLocationTickets(
    userId: string,
    locationId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<number> {
    return 145 // Mock data
  }

  private async getLocationEfficiency(
    userId: string,
    locationId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<number> {
    return 92 // Mock data
  }

  private async getLocationSatisfaction(
    userId: string,
    locationId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<number> {
    return 4.7 // Mock data
  }

  private async getCapacityUtilization(userId: string, dateRange: { start: Date; end: Date }) {
    return [
      { location: "Main Store", utilization: 85 },
      { location: "Downtown Branch", utilization: 72 },
      { location: "Mall Kiosk", utilization: 95 },
    ]
  }

  // Export functionality
  async exportAnalyticsData(
    userId: string,
    dateRange: { start: Date; end: Date },
    format: "csv" | "excel" | "pdf",
    sections: string[],
  ): Promise<Blob> {
    const data = await this.getAnalyticsData(userId, dateRange)

    if (format === "csv") {
      return this.exportToCSV(data, sections)
    } else if (format === "excel") {
      return this.exportToExcel(data, sections)
    } else {
      return this.exportToPDF(data, sections)
    }
  }

  private async exportToCSV(data: AnalyticsData, sections: string[]): Promise<Blob> {
    let csvContent = ""

    if (sections.includes("revenue")) {
      csvContent += "Revenue Analytics\n"
      csvContent += "Month,Revenue,Growth\n"
      data.revenue.monthlyRevenue.forEach((item) => {
        csvContent += `${item.month},${item.revenue},${item.growth}\n`
      })
      csvContent += "\n"
    }

    // Add other sections...

    return new Blob([csvContent], { type: "text/csv" })
  }

  private async exportToExcel(data: AnalyticsData, sections: string[]): Promise<Blob> {
    // Implementation for Excel export
    return new Blob([], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  }

  private async exportToPDF(data: AnalyticsData, sections: string[]): Promise<Blob> {
    // Implementation for PDF export
    return new Blob([], { type: "application/pdf" })
  }
}

export const analyticsService = new AnalyticsService()

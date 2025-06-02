"use client"

import { Badge } from "@/components/ui/badge"
import { RepairIndustry } from "@/lib/industry-config"
import { RepairVertical, getVerticalConfig } from "@/lib/industry-verticals"
import { IndustrySelector } from "@/components/industry-selector"
import VerticalDashboardRouter from "@/components/vertical-dashboard-router"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { DollarSign, Users, ShoppingBag, TrendingUp, Calendar, Clock, Wrench } from "lucide-react" // Added Wrench

export default function DashboardPage() {
  const { toast } = useToast()
  // Default to GENERAL_REPAIR for both vertical and industry
  const [userVertical, setUserVertical] = useState<RepairVertical>(RepairVertical.GENERAL_REPAIR)
  const [industry, setIndustry] = useState<RepairIndustry>(RepairIndustry.GENERAL_REPAIR)

  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingData, setIsFetchingData] = useState(true) // Separate loading for dashboard data
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "year">("week")
  const [dashboardData, setDashboardData] = useState<any>({
    stats: { totalSales: 0, totalTickets: 0, totalCustomers: 0, avgTicketValue: 0 },
    salesData: [],
    ticketStatusData: [],
    topSellingItems: [],
    upcomingAppointments: [],
  })

  useEffect(() => {
    setIsLoading(true) // For initial vertical/industry setup
    const savedVertical = localStorage.getItem("repairhq_vertical") as RepairVertical

    let initialVertical = RepairVertical.GENERAL_REPAIR
    if (savedVertical && verticalConfigs[savedVertical]) {
      initialVertical = savedVertical
    }

    setUserVertical(initialVertical)
    const verticalConf = getVerticalConfig(initialVertical)
    if (verticalConf) {
      setIndustry(verticalConf.correspondingIndustry)
    } else {
      setIndustry(RepairIndustry.GENERAL_REPAIR)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Fetch data only if it's the general dashboard view or if specific dashboards also need this data
    if (userVertical === RepairVertical.GENERAL_REPAIR) {
      fetchDashboardData()
    } else {
      // For specific verticals, their own dashboards might fetch data.
      // Or, you could pass this general data down if useful.
      // For now, set fetching to false if not general.
      setIsFetchingData(false)
    }
  }, [timeRange, userVertical])

  const handleVerticalChange = (newVertical: RepairVertical | null) => {
    if (newVertical) {
      setUserVertical(newVertical)
      const verticalConf = getVerticalConfig(newVertical)
      if (verticalConf) {
        setIndustry(verticalConf.correspondingIndustry)
        localStorage.setItem("repairhq_vertical", newVertical as string)
      } else {
        // Fallback if config not found (should not happen with newVertical check)
        setIndustry(RepairIndustry.GENERAL_REPAIR)
        localStorage.setItem("repairhq_vertical", RepairVertical.GENERAL_REPAIR as string)
      }
    } else {
      // Handle null case, perhaps default to general
      setUserVertical(RepairVertical.GENERAL_REPAIR)
      setIndustry(RepairIndustry.GENERAL_REPAIR)
      localStorage.setItem("repairhq_vertical", RepairVertical.GENERAL_REPAIR as string)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setIsFetchingData(true)
      const supabase = getSupabaseClient()
      let startDate, endDate
      const now = new Date()
      if (timeRange === "today") {
        startDate = startOfDay(now)
        endDate = endOfDay(now)
      } else if (timeRange === "week") {
        startDate = startOfDay(subDays(now, 6))
        endDate = endOfDay(now)
      } else if (timeRange === "month") {
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
      } else {
        startDate = startOfDay(subDays(now, 365))
        endDate = endOfDay(now)
      }

      const { data: salesDataRes, error: salesError } = await supabase
        .from("pos_transactions")
        .select("id, total_amount, created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .eq("payment_status", "completed")
      if (salesError) throw salesError
      const { data: ticketsDataRes, error: ticketsError } = await supabase
        .from("tickets")
        .select("id, status, created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
      if (ticketsError) throw ticketsError
      const { data: customersDataRes, error: customersError } = await supabase
        .from("customers")
        .select("id, created_at")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
      if (customersError) throw customersError
      const { data: topItemsDataRes, error: topItemsError } = await supabase
        .from("pos_transaction_items")
        .select("inventory_id, name, SUM(quantity) as total_quantity, SUM(total_price) as total_revenue")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .group("inventory_id, name")
        .order("total_quantity", { ascending: false })
        .limit(5)
      if (topItemsError) throw topItemsError
      const { data: appointmentsDataRes, error: appointmentsError } = await supabase
        .from("appointments")
        .select(`id, title, start_time, status, customer:customers(id, first_name, last_name)`)
        .gte("start_time", now.toISOString())
        .order("start_time")
        .limit(5)
      if (appointmentsError) throw appointmentsError

      const ticketStatusCounts: Record<string, number> = {}
      ticketsDataRes?.forEach((ticket) => {
        ticketStatusCounts[ticket.status] = (ticketStatusCounts[ticket.status] || 0) + 1
      })
      const ticketStatusData = Object.entries(ticketStatusCounts).map(([status, count]) => ({
        name: status,
        value: count,
      }))
      const salesByDay: Record<string, number> = {}
      salesDataRes?.forEach((sale) => {
        const day = format(new Date(sale.created_at), "MMM d")
        salesByDay[day] = (salesByDay[day] || 0) + sale.total_amount
      })
      const salesChartData = Object.entries(salesByDay).map(([day, amount]) => ({ day, amount }))
      const totalSales = salesDataRes?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0
      const avgTicketValue = ticketsDataRes?.length ? totalSales / ticketsDataRes.length : 0

      setDashboardData({
        stats: {
          totalSales,
          totalTickets: ticketsDataRes?.length || 0,
          totalCustomers: customersDataRes?.length || 0,
          avgTicketValue,
        },
        salesData: salesChartData,
        ticketStatusData,
        topSellingItems: topItemsDataRes || [],
        upcomingAppointments: appointmentsDataRes || [],
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({ title: "Error", description: "Failed to load dashboard data", variant: "destructive" })
    } finally {
      setIsFetchingData(false)
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0)
  const getStatusColor = (status: string) => {
    /* ... same as before ... */
    switch (status) {
      case "pending":
        return "#FFBB28"
      case "in_progress":
        return "#0088FE"
      case "waiting_for_parts":
        return "#8884D8"
      case "completed":
        return "#00C49F"
      case "cancelled":
        return "#FF8042"
      default:
        return "#CCCCCC"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading preferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="mb-6">
        <IndustrySelector
          currentIndustry={userVertical} // Pass current userVertical
          onIndustryChange={handleVerticalChange}
          // Removed props that are not in IndustrySelector definition
        />
      </div>

      {/* Display the IndustryTitleDisplay if needed, or remove if VerticalDashboardRouter handles titles */}
      {/* <IndustryTitleDisplay industry={industry} /> */}

      {/* Router for specific vertical dashboards */}
      {userVertical !== RepairVertical.GENERAL_REPAIR ? (
        <VerticalDashboardRouter userVertical={userVertical} />
      ) : // General Dashboard Content (if userVertical is GENERAL_REPAIR)
      isFetchingData ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Loading general dashboard data...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards for General Dashboard */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.totalSales)}</div>
                <p className="text-xs text-muted-foreground">
                  For {timeRange === "today" ? "today" : `the past ${timeRange}`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Repair Tickets</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalTickets}</div>
                <p className="text-xs text-muted-foreground">
                  For {timeRange === "today" ? "today" : `the past ${timeRange}`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  For {timeRange === "today" ? "today" : `the past ${timeRange}`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Ticket Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.avgTicketValue)}</div>
                <p className="text-xs text-muted-foreground">
                  For {timeRange === "today" ? "today" : `the past ${timeRange}`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts for General Dashboard */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" name="Sales" stroke="#0088FE" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ticket Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.ticketStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.ticketStatusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Tickets"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Items & Upcoming Appointments for General Dashboard */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Top Selling Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.topSellingItems.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData.topSellingItems}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => [value, "Quantity"]} />
                        <Legend />
                        <Bar dataKey="total_quantity" name="Quantity Sold" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-gray-500">No sales data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.upcomingAppointments.map((appointment: any) => (
                      <div key={appointment.id} className="flex items-start space-x-3 rounded-lg border p-3">
                        <div className="mt-0.5">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{appointment.title}</h4>
                            <Badge
                              className={
                                appointment.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : appointment.status === "scheduled"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {format(new Date(appointment.start_time), "MMM d, yyyy h:mm a")}
                          </p>
                          {appointment.customer && (
                            <p className="text-sm text-gray-600">
                              {appointment.customer.first_name} {appointment.customer.last_name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-gray-500">No upcoming appointments</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

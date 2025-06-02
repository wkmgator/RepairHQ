"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  DollarSign,
  Users,
  Download,
  MapPin,
  Package,
  Wrench,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  PieChartIcon,
  Activity,
  Award,
  Building,
} from "lucide-react"
import { analyticsService, type AnalyticsData } from "@/lib/analytics-service"
import { useAuth } from "@/lib/auth-context"
import { formatCurrency } from "@/lib/invoice-utils"

interface DateRange {
  from: Date
  to: Date
}

export function AdvancedAnalyticsDashboardComplete() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [refreshing, setRefreshing] = useState(false)
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv")
  const [exportSections, setExportSections] = useState<string[]>(["revenue", "tickets", "customers"])

  useEffect(() => {
    if (user?.uid) {
      loadAnalyticsData()
    }
  }, [user?.uid, dateRange, selectedLocation])

  const loadAnalyticsData = async () => {
    if (!user?.uid) return

    setLoading(true)
    try {
      const data = await analyticsService.getAnalyticsData(
        user.uid,
        { start: dateRange.from, end: dateRange.to },
        selectedLocation === "all" ? undefined : selectedLocation,
      )
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error loading analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalyticsData()
    setRefreshing(false)
  }

  const handleExport = async () => {
    if (!user?.uid || !analyticsData) return

    try {
      const blob = await analyticsService.exportAnalyticsData(
        user.uid,
        { start: dateRange.from, end: dateRange.to },
        exportFormat,
        exportSections,
      )

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `analytics-report-${dateRange.from.toISOString().split("T")[0]}-to-${dateRange.to.toISOString().split("T")[0]}.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">Unable to load analytics data. Please try again.</p>
          <Button onClick={loadAnalyticsData} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {analyticsData.locations.performanceByLocation.map((location) => (
                <SelectItem key={location.location} value={location.location}>
                  {location.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.revenue.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />+{analyticsData.revenue.yearOverYearGrowth}% from
              last year
            </p>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Profit Margin</div>
              <div className="text-sm font-medium">{analyticsData.revenue.profitMargin}%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.tickets.totalTickets}</div>
            <p className="text-xs text-muted-foreground">{analyticsData.tickets.completionRate}% completion rate</p>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Avg Resolution Time</div>
              <div className="text-sm font-medium">{analyticsData.tickets.averageResolutionTime}h</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customers.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">{analyticsData.customers.newCustomers} new this period</p>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Retention Rate</div>
              <div className="text-sm font-medium">{analyticsData.customers.retentionRate}%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.inventory.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Turnover rate: {analyticsData.inventory.turnoverRate}x</p>
            <div className="mt-2 flex items-center">
              <AlertTriangle className="mr-1 h-3 w-3 text-orange-600" />
              <div className="text-xs text-muted-foreground">
                {analyticsData.inventory.lowStockItems} items low stock
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.revenue.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="mr-2 h-5 w-5" />
                  Revenue by Service
                </CardTitle>
                <CardDescription>Service type breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.revenue.revenueByService}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ service, percentage }) => `${service} ${percentage}%`}
                    >
                      {analyticsData.revenue.revenueByService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Ticket Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.tickets.ticketsByStatus.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <span className="text-sm">{status.status}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={status.percentage} className="w-16" />
                        <span className="text-sm font-medium">{status.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.technicians.topPerformers.slice(0, 3).map((tech, index) => (
                    <div key={tech.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        <span className="text-sm">{tech.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{tech.ticketsCompleted} tickets</div>
                        <div className="text-xs text-muted-foreground">{tech.averageRating}★ rating</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Location Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.locations.performanceByLocation.map((location) => (
                    <div key={location.location} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{location.location}</span>
                        <span className="font-medium">{formatCurrency(location.revenue)}</span>
                      </div>
                      <Progress value={location.efficiency} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {location.efficiency}% efficiency • {location.tickets} tickets
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Detailed revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.revenue.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quarterly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.revenue.quarterlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Average Order Value</span>
                    <span className="text-lg font-bold">{formatCurrency(analyticsData.revenue.averageOrderValue)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-lg font-bold">{analyticsData.revenue.profitMargin}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">YoY Growth</span>
                    <span className="text-lg font-bold text-green-600">
                      +{analyticsData.revenue.yearOverYearGrowth}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Customer Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
                <CardDescription>Customer value distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.customers.segmentation}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ segment, count }) => `${segment}: ${count}`}
                    >
                      {analyticsData.customers.segmentation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Highest value customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.customers.topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.visits} visits</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(customer.totalSpent)}</div>
                        <div className="text-sm text-muted-foreground">Total spent</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {formatCurrency(analyticsData.customers.customerLifetimeValue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Lifetime Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{analyticsData.customers.satisfactionScore}/5</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Score</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn Risk</CardTitle>
                <CardDescription>Customers at risk of leaving</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.customers.churnRisk.map((customer) => (
                    <div key={customer.customerId} className="flex items-center justify-between">
                      <span className="text-sm">{customer.name}</span>
                      <Badge variant={customer.riskScore > 80 ? "destructive" : "secondary"}>
                        {customer.riskScore}% risk
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">New Customers</span>
                  <span className="font-medium">{analyticsData.customers.newCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Retention Rate</span>
                  <span className="font-medium">{analyticsData.customers.retentionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Customers</span>
                  <span className="font-medium">{analyticsData.customers.totalCustomers}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Technicians Tab */}
        <TabsContent value="technicians" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Technician Performance</CardTitle>
                <CardDescription>Individual performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.technicians.topPerformers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ticketsCompleted" fill="#3b82f6" name="Tickets Completed" />
                    <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity Trends</CardTitle>
                <CardDescription>Team productivity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.technicians.productivityTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="productivity" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill Analysis</CardTitle>
                <CardDescription>Skill demand vs availability</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analyticsData.technicians.skillAnalysis}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis />
                    <Radar name="Demand" dataKey="demand" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    <Radar
                      name="Availability"
                      dataKey="availability"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{analyticsData.technicians.totalTechnicians}</div>
                  <div className="text-sm text-muted-foreground">Total Technicians</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{analyticsData.technicians.averageTicketsPerTech}</div>
                  <div className="text-sm text-muted-foreground">Avg Tickets per Tech</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Top Performer</div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{analyticsData.technicians.topPerformers[0]?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {analyticsData.technicians.topPerformers[0]?.ticketsCompleted} tickets •
                      {analyticsData.technicians.topPerformers[0]?.averageRating}★ rating
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Best performing inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.inventory.topSellingItems}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="item" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="revenue" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
                <CardDescription>Delivery time vs quality</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={analyticsData.inventory.supplierPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="deliveryTime" name="Delivery Time (days)" />
                    <YAxis dataKey="quality" name="Quality Score" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "deliveryTime" ? `${value} days` : `${value}%`,
                        name === "deliveryTime" ? "Delivery Time" : "Quality Score",
                      ]}
                    />
                    <Scatter dataKey="quality" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(analyticsData.inventory.totalValue)}</div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{analyticsData.inventory.turnoverRate}x</div>
                  <div className="text-sm text-muted-foreground">Turnover Rate</div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">{analyticsData.inventory.lowStockItems} low stock items</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slow Moving Items</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.inventory.slowMovingItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{item.item}</div>
                        <div className="text-xs text-muted-foreground">{item.daysInStock} days</div>
                      </div>
                      <div className="text-sm font-medium">{formatCurrency(item.value)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Forecasted Demand</CardTitle>
                <CardDescription>AI-powered predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.inventory.forecastedDemand.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.item}</span>
                        <span className="text-sm">{item.predictedDemand} units</span>
                      </div>
                      <Progress value={item.confidence} className="h-2" />
                      <div className="text-xs text-muted-foreground">{item.confidence}% confidence</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Performance Comparison</CardTitle>
              <CardDescription>Multi-location analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.locations.performanceByLocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "revenue" ? formatCurrency(Number(value)) : value,
                      name === "revenue" ? "Revenue" : name,
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="tickets" fill="#10b981" name="Tickets" />
                  <Bar dataKey="efficiency" fill="#f59e0b" name="Efficiency %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Capacity Utilization</CardTitle>
                <CardDescription>Resource usage by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.locations.capacityUtilization.map((location) => (
                    <div key={location.location} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{location.location}</span>
                        <span className="font-medium">{location.utilization}%</span>
                      </div>
                      <Progress value={location.utilization} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{analyticsData.locations.totalLocations}</div>
                  <div className="text-sm text-muted-foreground">Total Locations</div>
                </div>
                <div className="space-y-3">
                  {analyticsData.locations.performanceByLocation.map((location) => (
                    <div key={location.location} className="p-3 border rounded-lg">
                      <div className="font-medium">{location.location}</div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>Revenue: {formatCurrency(location.revenue)}</div>
                        <div>Tickets: {location.tickets}</div>
                        <div>Efficiency: {location.efficiency}%</div>
                        <div>Satisfaction: {location.customerSatisfaction}/5</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>AI-powered revenue predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { month: "Current", actual: analyticsData.revenue.totalRevenue, forecast: null },
                      { month: "Next", actual: null, forecast: analyticsData.revenue.totalRevenue * 1.15 },
                      { month: "+2", actual: null, forecast: analyticsData.revenue.totalRevenue * 1.22 },
                      { month: "+3", actual: null, forecast: analyticsData.revenue.totalRevenue * 1.18 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demand Forecasting</CardTitle>
                <CardDescription>Predicted inventory needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.inventory.forecastedDemand.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.item}</span>
                        <Badge variant="outline">{item.confidence}% confidence</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Predicted demand: {item.predictedDemand} units
                      </div>
                      <Progress value={item.confidence} className="mt-2 h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seasonal Trends</CardTitle>
              <CardDescription>Historical patterns and future predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.tickets.seasonalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="tickets" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Modal */}
      <div className="fixed bottom-6 right-6">
        <Card className="w-80">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Export Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="export-format">Format</Label>
              <Select value={exportFormat} onValueChange={(value: "csv" | "excel" | "pdf") => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Include Sections</Label>
              <div className="space-y-2 mt-2">
                {[
                  { id: "revenue", label: "Revenue Analytics" },
                  { id: "customers", label: "Customer Data" },
                  { id: "tickets", label: "Ticket Analytics" },
                  { id: "technicians", label: "Technician Performance" },
                  { id: "inventory", label: "Inventory Analytics" },
                  { id: "locations", label: "Location Performance" },
                ].map((section) => (
                  <div key={section.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={section.id}
                      checked={exportSections.includes(section.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setExportSections([...exportSections, section.id])
                        } else {
                          setExportSections(exportSections.filter((s) => s !== section.id))
                        }
                      }}
                    />
                    <Label htmlFor={section.id} className="text-sm">
                      {section.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

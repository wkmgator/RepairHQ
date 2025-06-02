"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AlertTriangle, Calendar, Download, Filter, Search, TrendingDown, TrendingUp } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  status: "active" | "inactive" | "pending"
}

interface SupplierPerformance {
  id: string
  supplier_id: string
  supplier_name: string
  on_time_delivery_rate: number
  quality_rating: number
  response_time: number
  fulfillment_rate: number
  price_competitiveness: number
  total_orders: number
  total_spend: number
  defect_rate: number
  return_rate: number
  last_updated: string
}

interface SupplierTrend {
  month: string
  on_time_delivery_rate: number
  quality_rating: number
  response_time: number
  fulfillment_rate: number
}

export default function SupplierPerformanceAnalytics() {
  const [loading, setLoading] = useState(true)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [performance, setPerformance] = useState<SupplierPerformance[]>([])
  const [trends, setTrends] = useState<SupplierTrend[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("6m")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchSupplierData()
  }, [])

  useEffect(() => {
    if (selectedSupplier) {
      fetchSupplierTrends(selectedSupplier, timeRange)
    }
  }, [selectedSupplier, timeRange])

  const fetchSupplierData = async () => {
    setLoading(true)
    try {
      // In a real app, these would be actual Supabase queries
      // Fetch suppliers
      const { data: suppliersData } = await supabase.from("suppliers").select("*").order("name", { ascending: true })

      // Fetch performance metrics
      const { data: performanceData } = await supabase
        .from("supplier_performance")
        .select("*, suppliers(name)")
        .order("quality_rating", { ascending: false })

      // Simulate data for demo
      setSuppliers([
        {
          id: "sup-1",
          name: "TechParts Inc.",
          contact: "John Smith",
          email: "john@techparts.com",
          phone: "555-123-4567",
          status: "active",
        },
        {
          id: "sup-2",
          name: "MobileSupplies Co.",
          contact: "Sarah Johnson",
          email: "sarah@mobilesupplies.com",
          phone: "555-987-6543",
          status: "active",
        },
        {
          id: "sup-3",
          name: "ScreenFix Solutions",
          contact: "Mike Williams",
          email: "mike@screenfix.com",
          phone: "555-456-7890",
          status: "active",
        },
        {
          id: "sup-4",
          name: "BatteryWorld",
          contact: "Lisa Brown",
          email: "lisa@batteryworld.com",
          phone: "555-789-0123",
          status: "inactive",
        },
        {
          id: "sup-5",
          name: "ChipTech Components",
          contact: "David Lee",
          email: "david@chiptech.com",
          phone: "555-234-5678",
          status: "active",
        },
      ])

      setPerformance([
        {
          id: "perf-1",
          supplier_id: "sup-1",
          supplier_name: "TechParts Inc.",
          on_time_delivery_rate: 94.2,
          quality_rating: 4.7,
          response_time: 3.2,
          fulfillment_rate: 98.1,
          price_competitiveness: 4.2,
          total_orders: 342,
          total_spend: 128750,
          defect_rate: 1.2,
          return_rate: 2.3,
          last_updated: "2023-11-15T14:23:45Z",
        },
        {
          id: "perf-2",
          supplier_id: "sup-2",
          supplier_name: "MobileSupplies Co.",
          on_time_delivery_rate: 88.7,
          quality_rating: 4.3,
          response_time: 5.1,
          fulfillment_rate: 95.4,
          price_competitiveness: 4.5,
          total_orders: 287,
          total_spend: 103420,
          defect_rate: 2.1,
          return_rate: 3.2,
          last_updated: "2023-11-14T10:15:22Z",
        },
        {
          id: "perf-3",
          supplier_id: "sup-3",
          supplier_name: "ScreenFix Solutions",
          on_time_delivery_rate: 91.5,
          quality_rating: 4.5,
          response_time: 4.3,
          fulfillment_rate: 97.2,
          price_competitiveness: 3.9,
          total_orders: 198,
          total_spend: 87650,
          defect_rate: 1.8,
          return_rate: 2.7,
          last_updated: "2023-11-13T16:42:18Z",
        },
        {
          id: "perf-4",
          supplier_id: "sup-4",
          supplier_name: "BatteryWorld",
          on_time_delivery_rate: 82.3,
          quality_rating: 3.8,
          response_time: 6.7,
          fulfillment_rate: 91.8,
          price_competitiveness: 4.7,
          total_orders: 124,
          total_spend: 45980,
          defect_rate: 3.5,
          return_rate: 4.8,
          last_updated: "2023-11-12T09:34:51Z",
        },
        {
          id: "perf-5",
          supplier_id: "sup-5",
          supplier_name: "ChipTech Components",
          on_time_delivery_rate: 96.8,
          quality_rating: 4.8,
          response_time: 2.5,
          fulfillment_rate: 99.3,
          price_competitiveness: 3.7,
          total_orders: 231,
          total_spend: 112340,
          defect_rate: 0.8,
          return_rate: 1.5,
          last_updated: "2023-11-15T11:27:33Z",
        },
      ])

      if (!selectedSupplier && performance.length > 0) {
        setSelectedSupplier(performance[0].supplier_id)
      }
    } catch (error) {
      console.error("Error fetching supplier data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSupplierTrends = async (supplierId: string, period: string) => {
    try {
      // In a real app, this would be an actual Supabase query
      // Fetch trend data for the selected supplier
      const { data: trendsData } = await supabase
        .from("supplier_performance_history")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("month", { ascending: true })
        .limit(getMonthsForPeriod(period))

      // Simulate data for demo
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      const currentMonth = new Date().getMonth()
      const trendData: SupplierTrend[] = []

      // Generate 6 months of data by default
      const monthCount = getMonthsForPeriod(period)

      for (let i = monthCount - 1; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        const supplierPerf = performance.find((p) => p.supplier_id === supplierId)

        if (supplierPerf) {
          // Create some variation in the data
          const randomFactor = 0.9 + Math.random() * 0.2 // Between 0.9 and 1.1
          const randomTrend = i / monthCount // Gradual improvement trend

          trendData.push({
            month: months[monthIndex],
            on_time_delivery_rate: Math.min(
              100,
              supplierPerf.on_time_delivery_rate * (randomFactor - 0.05 * randomTrend),
            ),
            quality_rating: Math.min(5, supplierPerf.quality_rating * (randomFactor - 0.03 * randomTrend)),
            response_time: Math.max(1, supplierPerf.response_time * (randomFactor + 0.05 * randomTrend)),
            fulfillment_rate: Math.min(100, supplierPerf.fulfillment_rate * (randomFactor - 0.02 * randomTrend)),
          })
        }
      }

      setTrends(trendData.reverse()) // Most recent month last
    } catch (error) {
      console.error("Error fetching supplier trends:", error)
    }
  }

  const getMonthsForPeriod = (period: string): number => {
    switch (period) {
      case "3m":
        return 3
      case "6m":
        return 6
      case "1y":
        return 12
      case "2y":
        return 24
      default:
        return 6
    }
  }

  const getPerformanceColor = (value: number, metric: string): string => {
    if (metric === "response_time" || metric === "defect_rate" || metric === "return_rate") {
      // For these metrics, lower is better
      if (value <= 2) return "text-green-600"
      if (value <= 4) return "text-yellow-600"
      return "text-red-600"
    } else {
      // For other metrics, higher is better
      if (value >= 90 || value >= 4.5) return "text-green-600"
      if (value >= 80 || value >= 4.0) return "text-yellow-600"
      return "text-red-600"
    }
  }

  const getPerformanceTrend = (
    supplierId: string,
    metric: string,
  ): { trend: "up" | "down" | "stable"; value: number } => {
    if (trends.length < 2) return { trend: "stable", value: 0 }

    const firstValue = trends[0][metric as keyof SupplierTrend] as number
    const lastValue = trends[trends.length - 1][metric as keyof SupplierTrend] as number

    const difference =
      metric === "response_time"
        ? firstValue - lastValue // For response time, decrease is good
        : lastValue - firstValue // For other metrics, increase is good

    const percentChange = (difference / firstValue) * 100

    if (Math.abs(percentChange) < 1) return { trend: "stable", value: 0 }
    return {
      trend: percentChange > 0 ? "up" : "down",
      value: Math.abs(percentChange),
    }
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredPerformance = performance.filter((perf) =>
    perf.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Supplier Performance Analytics</h1>
          <p className="text-gray-600">Monitor and analyze your supplier performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
            <SelectItem value="2y">Last 2 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average On-Time Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performance.reduce((acc, curr) => acc + curr.on_time_delivery_rate, 0) / performance.length}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {performance.filter((p) => p.on_time_delivery_rate >= 90).length} suppliers above 90%
                </p>
                <Progress
                  value={performance.reduce((acc, curr) => acc + curr.on_time_delivery_rate, 0) / performance.length}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Quality Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(performance.reduce((acc, curr) => acc + curr.quality_rating, 0) / performance.length).toFixed(1)}
                  /5.0
                </div>
                <p className="text-xs text-muted-foreground">
                  {performance.filter((p) => p.quality_rating >= 4.5).length} suppliers above 4.5
                </p>
                <Progress
                  value={(performance.reduce((acc, curr) => acc + curr.quality_rating, 0) / performance.length) * 20}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(performance.reduce((acc, curr) => acc + curr.response_time, 0) / performance.length).toFixed(1)} hrs
                </div>
                <p className="text-xs text-muted-foreground">
                  {performance.filter((p) => p.response_time <= 4).length} suppliers under 4 hours
                </p>
                <Progress
                  value={
                    100 - (performance.reduce((acc, curr) => acc + curr.response_time, 0) / performance.length) * 10
                  }
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Fulfillment Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(performance.reduce((acc, curr) => acc + curr.fulfillment_rate, 0) / performance.length).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {performance.filter((p) => p.fulfillment_rate >= 95).length} suppliers above 95%
                </p>
                <Progress
                  value={performance.reduce((acc, curr) => acc + curr.fulfillment_rate, 0) / performance.length}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Top and Bottom Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Suppliers</CardTitle>
                <CardDescription>Based on overall quality rating</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>On-Time</TableHead>
                      <TableHead>Fulfillment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...filteredPerformance]
                      .sort((a, b) => b.quality_rating - a.quality_rating)
                      .slice(0, 5)
                      .map((perf) => (
                        <TableRow key={perf.id}>
                          <TableCell className="font-medium">{perf.supplier_name}</TableCell>
                          <TableCell className={getPerformanceColor(perf.quality_rating, "quality_rating")}>
                            {perf.quality_rating.toFixed(1)}/5.0
                          </TableCell>
                          <TableCell
                            className={getPerformanceColor(perf.on_time_delivery_rate, "on_time_delivery_rate")}
                          >
                            {perf.on_time_delivery_rate.toFixed(1)}%
                          </TableCell>
                          <TableCell className={getPerformanceColor(perf.fulfillment_rate, "fulfillment_rate")}>
                            {perf.fulfillment_rate.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suppliers Needing Improvement</CardTitle>
                <CardDescription>Based on overall quality rating</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>On-Time</TableHead>
                      <TableHead>Fulfillment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...filteredPerformance]
                      .sort((a, b) => a.quality_rating - b.quality_rating)
                      .slice(0, 5)
                      .map((perf) => (
                        <TableRow key={perf.id}>
                          <TableCell className="font-medium">{perf.supplier_name}</TableCell>
                          <TableCell className={getPerformanceColor(perf.quality_rating, "quality_rating")}>
                            {perf.quality_rating.toFixed(1)}/5.0
                          </TableCell>
                          <TableCell
                            className={getPerformanceColor(perf.on_time_delivery_rate, "on_time_delivery_rate")}
                          >
                            {perf.on_time_delivery_rate.toFixed(1)}%
                          </TableCell>
                          <TableCell className={getPerformanceColor(perf.fulfillment_rate, "fulfillment_rate")}>
                            {perf.fulfillment_rate.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Risk Assessment</CardTitle>
              <CardDescription>Suppliers with potential issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPerformance
                  .filter(
                    (perf) =>
                      perf.on_time_delivery_rate < 85 ||
                      perf.quality_rating < 4.0 ||
                      perf.fulfillment_rate < 90 ||
                      perf.defect_rate > 3.0,
                  )
                  .map((perf) => (
                    <div key={perf.id} className="flex items-start p-4 border rounded-lg">
                      <div className="p-2 bg-yellow-50 rounded-full mr-4">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{perf.supplier_name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                          {perf.on_time_delivery_rate < 85 && (
                            <div className="text-sm text-red-600">
                              Low on-time delivery: {perf.on_time_delivery_rate.toFixed(1)}%
                            </div>
                          )}
                          {perf.quality_rating < 4.0 && (
                            <div className="text-sm text-red-600">
                              Low quality rating: {perf.quality_rating.toFixed(1)}/5.0
                            </div>
                          )}
                          {perf.fulfillment_rate < 90 && (
                            <div className="text-sm text-red-600">
                              Low fulfillment rate: {perf.fulfillment_rate.toFixed(1)}%
                            </div>
                          )}
                          {perf.defect_rate > 3.0 && (
                            <div className="text-sm text-red-600">High defect rate: {perf.defect_rate.toFixed(1)}%</div>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  ))}

                {filteredPerformance.filter(
                  (perf) =>
                    perf.on_time_delivery_rate < 85 ||
                    perf.quality_rating < 4.0 ||
                    perf.fulfillment_rate < 90 ||
                    perf.defect_rate > 3.0,
                ).length === 0 && (
                  <div className="text-center py-8">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No High-Risk Suppliers</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      All suppliers are currently performing within acceptable parameters.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance Metrics</CardTitle>
              <CardDescription>Detailed performance data for all suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Quality Rating</TableHead>
                      <TableHead>On-Time Delivery</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Fulfillment Rate</TableHead>
                      <TableHead>Price Competitiveness</TableHead>
                      <TableHead>Defect Rate</TableHead>
                      <TableHead>Return Rate</TableHead>
                      <TableHead>Total Orders</TableHead>
                      <TableHead>Total Spend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPerformance.map((perf) => (
                      <TableRow
                        key={perf.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedSupplier(perf.supplier_id)}
                      >
                        <TableCell className="font-medium">{perf.supplier_name}</TableCell>
                        <TableCell className={getPerformanceColor(perf.quality_rating, "quality_rating")}>
                          {perf.quality_rating.toFixed(1)}/5.0
                        </TableCell>
                        <TableCell className={getPerformanceColor(perf.on_time_delivery_rate, "on_time_delivery_rate")}>
                          {perf.on_time_delivery_rate.toFixed(1)}%
                        </TableCell>
                        <TableCell className={getPerformanceColor(perf.response_time, "response_time")}>
                          {perf.response_time.toFixed(1)} hrs
                        </TableCell>
                        <TableCell className={getPerformanceColor(perf.fulfillment_rate, "fulfillment_rate")}>
                          {perf.fulfillment_rate.toFixed(1)}%
                        </TableCell>
                        <TableCell className={getPerformanceColor(perf.price_competitiveness, "price_competitiveness")}>
                          {perf.price_competitiveness.toFixed(1)}/5.0
                        </TableCell>
                        <TableCell className={getPerformanceColor(perf.defect_rate, "defect_rate")}>
                          {perf.defect_rate.toFixed(1)}%
                        </TableCell>
                        <TableCell className={getPerformanceColor(perf.return_rate, "return_rate")}>
                          {perf.return_rate.toFixed(1)}%
                        </TableCell>
                        <TableCell>{perf.total_orders}</TableCell>
                        <TableCell>${perf.total_spend.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Historical performance data</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <Select value={selectedSupplier || ""} onValueChange={setSelectedSupplier}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedSupplier && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {["on_time_delivery_rate", "quality_rating", "response_time", "fulfillment_rate"].map((metric) => {
                      const trend = getPerformanceTrend(selectedSupplier, metric)
                      const metricName = {
                        on_time_delivery_rate: "On-Time Delivery",
                        quality_rating: "Quality Rating",
                        response_time: "Response Time",
                        fulfillment_rate: "Fulfillment Rate",
                      }[metric]

                      const isPositive = metric === "response_time" ? trend.trend === "down" : trend.trend === "up"

                      return (
                        <Card key={metric}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{metricName}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center">
                              <div className="text-2xl font-bold mr-2">
                                {metric === "quality_rating"
                                  ? `${trends[trends.length - 1]?.[metric as keyof SupplierTrend]?.toFixed(1)}/5.0`
                                  : metric === "response_time"
                                    ? `${trends[trends.length - 1]?.[metric as keyof SupplierTrend]?.toFixed(1)} hrs`
                                    : `${trends[trends.length - 1]?.[metric as keyof SupplierTrend]?.toFixed(1)}%`}
                              </div>
                              {trend.trend !== "stable" && (
                                <Badge
                                  className={isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                >
                                  {isPositive ? (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                  )}
                                  {trend.value.toFixed(1)}%
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>On-Time Delivery & Fulfillment Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ChartContainer
                            config={{
                              on_time_delivery_rate: {
                                label: "On-Time Delivery",
                                color: "hsl(var(--chart-1))",
                              },
                              fulfillment_rate: {
                                label: "Fulfillment Rate",
                                color: "hsl(var(--chart-2))",
                              },
                            }}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[70, 100]} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="on_time_delivery_rate"
                                  stroke="var(--color-on_time_delivery_rate)"
                                  name="On-Time Delivery"
                                  strokeWidth={2}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="fulfillment_rate"
                                  stroke="var(--color-fulfillment_rate)"
                                  name="Fulfillment Rate"
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quality Rating & Response Time Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ChartContainer
                            config={{
                              quality_rating: {
                                label: "Quality Rating",
                                color: "hsl(var(--chart-3))",
                              },
                              response_time: {
                                label: "Response Time (hrs)",
                                color: "hsl(var(--chart-4))",
                              },
                            }}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" domain={[3, 5]} />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="quality_rating"
                                  stroke="var(--color-quality_rating)"
                                  name="Quality Rating"
                                  yAxisId="left"
                                  strokeWidth={2}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="response_time"
                                  stroke="var(--color-response_time)"
                                  name="Response Time (hrs)"
                                  yAxisId="right"
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Directory</CardTitle>
              <CardDescription>Contact information and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => {
                      const perf = performance.find((p) => p.supplier_id === supplier.id)
                      return (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          <TableCell>{supplier.contact}</TableCell>
                          <TableCell>{supplier.email}</TableCell>
                          <TableCell>{supplier.phone}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                supplier.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : supplier.status === "inactive"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {perf && (
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div
                                    className={`h-2.5 rounded-full ${
                                      perf.quality_rating >= 4.5
                                        ? "bg-green-600"
                                        : perf.quality_rating >= 4.0
                                          ? "bg-yellow-600"
                                          : "bg-red-600"
                                    }`}
                                    style={{ width: `${(perf.quality_rating / 5) * 100}%` }}
                                  ></div>
                                </div>
                                <span>{perf.quality_rating.toFixed(1)}/5.0</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => setSelectedSupplier(supplier.id)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { createClient } from "@/lib/supabase"
import { Brain, AlertTriangle, Download, RefreshCw } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type AnalyticsData = {
  salesData: any[]
  inventoryData: any[]
  customerData: any[]
  serviceData: any[]
  employeeData: any[]
}

type InsightType = {
  title: string
  description: string
  type: "positive" | "negative" | "neutral"
  metric?: string
  value?: number
  previousValue?: number
  change?: number
}

export default function AIAnalyticsEngine() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [insights, setInsights] = useState<InsightType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("sales")
  const [dateRange, setDateRange] = useState("30days")
  const [refreshKey, setRefreshKey] = useState(0)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const supabase = createClient()

        // Fetch sales data
        const { data: salesData, error: salesError } = await supabase
          .from("transactions")
          .select("id, created_at, total, payment_method, customer_id")
          .order("created_at", { ascending: false })
          .limit(100)

        if (salesError) throw new Error(`Error fetching sales data: ${salesError.message}`)

        // Fetch inventory data
        const { data: inventoryData, error: inventoryError } = await supabase
          .from("inventory")
          .select("id, name, quantity, price, cost, category")
          .order("quantity", { ascending: true })
          .limit(100)

        if (inventoryError) throw new Error(`Error fetching inventory data: ${inventoryError.message}`)

        // Fetch customer data
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("id, created_at, name, email, phone, total_spent, visit_count")
          .order("total_spent", { ascending: false })
          .limit(100)

        if (customerError) throw new Error(`Error fetching customer data: ${customerError.message}`)

        // Fetch service data
        const { data: serviceData, error: serviceError } = await supabase
          .from("tickets")
          .select("id, created_at, status, service_type, total, customer_id")
          .order("created_at", { ascending: false })
          .limit(100)

        if (serviceError) throw new Error(`Error fetching service data: ${serviceError.message}`)

        // Fetch employee data
        const { data: employeeData, error: employeeError } = await supabase
          .from("employees")
          .select("id, name, role, performance_score, tickets_completed, average_ticket_value")
          .order("performance_score", { ascending: false })
          .limit(100)

        if (employeeError) throw new Error(`Error fetching employee data: ${employeeError.message}`)

        setData({
          salesData: processDateRange(salesData || [], dateRange),
          inventoryData: inventoryData || [],
          customerData: customerData || [],
          serviceData: processDateRange(serviceData || [], dateRange),
          employeeData: employeeData || [],
        })

        // Generate initial insights
        if (salesData && inventoryData && customerData && serviceData && employeeData) {
          generateInsights({
            salesData: processDateRange(salesData, dateRange),
            inventoryData,
            customerData,
            serviceData: processDateRange(serviceData, dateRange),
            employeeData,
          })
        }
      } catch (err: any) {
        console.error("Error fetching analytics data:", err)
        setError(err.message || "Failed to load analytics data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange, refreshKey])

  const processDateRange = (data: any[], range: string) => {
    const now = new Date()
    let cutoffDate: Date

    switch (range) {
      case "7days":
        cutoffDate = new Date(now.setDate(now.getDate() - 7))
        break
      case "90days":
        cutoffDate = new Date(now.setDate(now.getDate() - 90))
        break
      case "1year":
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      case "30days":
      default:
        cutoffDate = new Date(now.setDate(now.getDate() - 30))
        break
    }

    return data.filter((item) => new Date(item.created_at) >= cutoffDate)
  }

  const generateInsights = async (analyticsData: AnalyticsData) => {
    setIsGeneratingInsights(true)
    try {
      // Calculate basic metrics
      const basicInsights = calculateBasicInsights(analyticsData)
      setInsights(basicInsights)

      // Use AI to generate deeper insights
      const aiInsights = await generateAIInsights(analyticsData, basicInsights)
      setInsights([...basicInsights, ...aiInsights])
    } catch (err: any) {
      console.error("Error generating insights:", err)
      setError(`Failed to generate AI insights: ${err.message}`)
    } finally {
      setIsGeneratingInsights(false)
    }
  }

  const calculateBasicInsights = (analyticsData: AnalyticsData): InsightType[] => {
    const insights: InsightType[] = []

    // Sales insights
    if (analyticsData.salesData.length > 0) {
      const totalSales = analyticsData.salesData.reduce((sum, item) => sum + (Number.parseFloat(item.total) || 0), 0)
      const avgTicketValue = totalSales / analyticsData.salesData.length

      insights.push({
        title: "Total Sales",
        description: `Total sales for the selected period is $${totalSales.toFixed(2)}`,
        type: "positive",
        metric: "Revenue",
        value: totalSales,
      })

      insights.push({
        title: "Average Ticket Value",
        description: `Average ticket value is $${avgTicketValue.toFixed(2)}`,
        type: "neutral",
        metric: "Average Sale",
        value: avgTicketValue,
      })
    }

    // Inventory insights
    if (analyticsData.inventoryData.length > 0) {
      const lowStockItems = analyticsData.inventoryData.filter((item) => item.quantity < 5).length

      insights.push({
        title: "Low Stock Alert",
        description: `${lowStockItems} items are running low on stock`,
        type: lowStockItems > 10 ? "negative" : "neutral",
        metric: "Low Stock Items",
        value: lowStockItems,
      })
    }

    // Customer insights
    if (analyticsData.customerData.length > 0) {
      const totalCustomers = analyticsData.customerData.length
      const highValueCustomers = analyticsData.customerData.filter((c) => Number.parseFloat(c.total_spent) > 500).length

      insights.push({
        title: "High-Value Customers",
        description: `${highValueCustomers} customers have spent over $500`,
        type: "positive",
        metric: "VIP Customers",
        value: highValueCustomers,
        previousValue: totalCustomers,
        change: (highValueCustomers / totalCustomers) * 100,
      })
    }

    return insights
  }

  const generateAIInsights = async (
    analyticsData: AnalyticsData,
    basicInsights: InsightType[],
  ): Promise<InsightType[]> => {
    try {
      // Prepare data for AI analysis
      const dataForAI = {
        salesSummary: summarizeData(analyticsData.salesData, "sales"),
        inventorySummary: summarizeData(analyticsData.inventoryData, "inventory"),
        customerSummary: summarizeData(analyticsData.customerData, "customers"),
        serviceSummary: summarizeData(analyticsData.serviceData, "services"),
        employeeSummary: summarizeData(analyticsData.employeeData, "employees"),
        basicInsights: basicInsights.map((i) => `${i.title}: ${i.description}`),
      }

      const prompt = `
        As an AI business analyst for a repair shop management system, analyze this business data and provide 3 actionable insights:
        
        Sales Data Summary: ${JSON.stringify(dataForAI.salesSummary)}
        Inventory Data Summary: ${JSON.stringify(dataForAI.inventorySummary)}
        Customer Data Summary: ${JSON.stringify(dataForAI.customerSummary)}
        Service Data Summary: ${JSON.stringify(dataForAI.serviceSummary)}
        Employee Data Summary: ${JSON.stringify(dataForAI.employeeSummary)}
        
        Format each insight as a JSON object with these fields:
        - title: A short, specific title for the insight
        - description: A detailed explanation with specific numbers and recommendations
        - type: Either "positive", "negative", or "neutral" based on the nature of the insight
        
        Return ONLY a valid JSON array of these 3 insights without any additional text.
      `

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
        maxTokens: 1000,
      })

      try {
        // Parse the AI response
        const aiInsightsRaw = JSON.parse(text.trim())

        // Validate and format the insights
        const aiInsights: InsightType[] = aiInsightsRaw.map((insight: any) => ({
          title: insight.title,
          description: insight.description,
          type: insight.type as "positive" | "negative" | "neutral",
        }))

        return aiInsights
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError)
        return [
          {
            title: "AI Analysis Available",
            description: "AI-generated insights are available but couldn't be processed. Try refreshing the analysis.",
            type: "neutral",
          },
        ]
      }
    } catch (error) {
      console.error("Error in AI insight generation:", error)
      return [
        {
          title: "AI Analysis Unavailable",
          description: "Unable to generate AI insights at this time. Please try again later.",
          type: "negative",
        },
      ]
    }
  }

  const summarizeData = (data: any[], type: string) => {
    if (!data || data.length === 0) return { count: 0, message: "No data available" }

    switch (type) {
      case "sales":
        const totalSales = data.reduce((sum, item) => sum + (Number.parseFloat(item.total) || 0), 0)
        const paymentMethods = data.reduce((acc: any, item) => {
          acc[item.payment_method] = (acc[item.payment_method] || 0) + 1
          return acc
        }, {})

        return {
          count: data.length,
          totalValue: totalSales.toFixed(2),
          averageValue: (totalSales / data.length).toFixed(2),
          paymentMethodBreakdown: paymentMethods,
        }

      case "inventory":
        const totalValue = data.reduce(
          (sum, item) => sum + (Number.parseFloat(item.price) || 0) * (item.quantity || 0),
          0,
        )
        const lowStock = data.filter((item) => item.quantity < 5).length
        const categories = data.reduce((acc: any, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1
          return acc
        }, {})

        return {
          count: data.length,
          totalValue: totalValue.toFixed(2),
          lowStockItems: lowStock,
          categoryBreakdown: categories,
        }

      case "customers":
        const totalSpent = data.reduce((sum, item) => sum + (Number.parseFloat(item.total_spent) || 0), 0)
        const avgSpent = totalSpent / data.length
        const highValue = data.filter((c) => Number.parseFloat(c.total_spent) > 500).length

        return {
          count: data.length,
          totalSpent: totalSpent.toFixed(2),
          averageSpent: avgSpent.toFixed(2),
          highValueCustomers: highValue,
        }

      case "services":
        const serviceTypes = data.reduce((acc: any, item) => {
          acc[item.service_type] = (acc[item.service_type] || 0) + 1
          return acc
        }, {})

        const statusBreakdown = data.reduce((acc: any, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1
          return acc
        }, {})

        return {
          count: data.length,
          serviceTypeBreakdown: serviceTypes,
          statusBreakdown: statusBreakdown,
        }

      case "employees":
        const avgPerformance =
          data.reduce((sum, item) => sum + (Number.parseFloat(item.performance_score) || 0), 0) / data.length
        const topPerformers = data.filter((e) => Number.parseFloat(e.performance_score) > 80).length

        return {
          count: data.length,
          averagePerformance: avgPerformance.toFixed(2),
          topPerformers: topPerformers,
        }

      default:
        return { count: data.length }
    }
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleExport = () => {
    if (!data) return

    const exportData = {
      generatedAt: new Date().toISOString(),
      dateRange,
      insights,
      data,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `repairhq-analytics-${dateRange}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <Skeleton className="h-8 w-64" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Analytics Error
          </CardTitle>
          <CardDescription>There was a problem loading the analytics data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>There is no analytics data to display</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI-Powered Business Analytics
        </CardTitle>
        <CardDescription>Intelligent insights and trends analysis for your repair business</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Date Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.salesData.map((item) => ({
                    date: new Date(item.created_at).toLocaleDateString(),
                    amount: Number.parseFloat(item.total) || 0,
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} name="Sales Amount" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(
                            data.salesData.reduce((acc: any, item) => {
                              acc[item.payment_method] = (acc[item.payment_method] || 0) + 1
                              return acc
                            }, {}),
                          ).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(
                            data.salesData.reduce((acc: any, item) => {
                              acc[item.payment_method] = (acc[item.payment_method] || 0) + 1
                              return acc
                            }, {}),
                          ).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Sales Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Sales:</span>
                      <span className="font-medium">
                        $
                        {data.salesData.reduce((sum, item) => sum + (Number.parseFloat(item.total) || 0), 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Sale:</span>
                      <span className="font-medium">
                        $
                        {(
                          data.salesData.reduce((sum, item) => sum + (Number.parseFloat(item.total) || 0), 0) /
                          (data.salesData.length || 1)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transaction Count:</span>
                      <span className="font-medium">{data.salesData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Highest Sale:</span>
                      <span className="font-medium">
                        ${Math.max(...data.salesData.map((item) => Number.parseFloat(item.total) || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.inventoryData
                    .sort((a, b) => b.quantity * b.price - a.quantity * a.price)
                    .slice(0, 10)
                    .map((item) => ({
                      name: item.name,
                      value: item.quantity * item.price || 0,
                    }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Inventory Value" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Inventory by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(
                            data.inventoryData.reduce((acc: any, item) => {
                              acc[item.category] = (acc[item.category] || 0) + 1
                              return acc
                            }, {}),
                          ).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(
                            data.inventoryData.reduce((acc: any, item) => {
                              acc[item.category] = (acc[item.category] || 0) + 1
                              return acc
                            }, {}),
                          ).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Inventory Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Items:</span>
                      <span className="font-medium">{data.inventoryData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Value:</span>
                      <span className="font-medium">
                        $
                        {data.inventoryData
                          .reduce((sum, item) => sum + (Number.parseFloat(item.price) || 0) * (item.quantity || 0), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Low Stock Items:</span>
                      <span className="font-medium">
                        {data.inventoryData.filter((item) => item.quantity < 5).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Out of Stock:</span>
                      <span className="font-medium">
                        {data.inventoryData.filter((item) => item.quantity === 0).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.customerData
                    .sort((a, b) => Number.parseFloat(b.total_spent) - Number.parseFloat(a.total_spent))
                    .slice(0, 10)
                    .map((item) => ({
                      name: item.name,
                      spent: Number.parseFloat(item.total_spent) || 0,
                      visits: item.visit_count || 0,
                    }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="spent" fill="#8884d8" name="Total Spent ($)" />
                  <Bar yAxisId="right" dataKey="visits" fill="#82ca9d" name="Visit Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Customer Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "VIP (>$500)",
                              value: data.customerData.filter((c) => Number.parseFloat(c.total_spent) > 500).length,
                            },
                            {
                              name: "Regular ($100-$500)",
                              value: data.customerData.filter(
                                (c) =>
                                  Number.parseFloat(c.total_spent) >= 100 && Number.parseFloat(c.total_spent) <= 500,
                              ).length,
                            },
                            {
                              name: "New (<$100)",
                              value: data.customerData.filter((c) => Number.parseFloat(c.total_spent) < 100).length,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            {
                              name: "VIP (>$500)",
                              value: data.customerData.filter((c) => Number.parseFloat(c.total_spent) > 500).length,
                            },
                            {
                              name: "Regular ($100-$500)",
                              value: data.customerData.filter(
                                (c) =>
                                  Number.parseFloat(c.total_spent) >= 100 && Number.parseFloat(c.total_spent) <= 500,
                              ).length,
                            },
                            {
                              name: "New (<$100)",
                              value: data.customerData.filter((c) => Number.parseFloat(c.total_spent) < 100).length,
                            },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Customer Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Customers:</span>
                      <span className="font-medium">{data.customerData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue:</span>
                      <span className="font-medium">
                        $
                        {data.customerData
                          .reduce((sum, item) => sum + (Number.parseFloat(item.total_spent) || 0), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Customer Value:</span>
                      <span className="font-medium">
                        $
                        {(
                          data.customerData.reduce((sum, item) => sum + (Number.parseFloat(item.total_spent) || 0), 0) /
                          (data.customerData.length || 1)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">VIP Customers:</span>
                      <span className="font-medium">
                        {data.customerData.filter((c) => Number.parseFloat(c.total_spent) > 500).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(
                    data.serviceData.reduce((acc: any, item) => {
                      acc[item.service_type] = (acc[item.service_type] || 0) + 1
                      return acc
                    }, {}),
                  ).map(([name, count]) => ({ name, count }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Service Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Service Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(
                            data.serviceData.reduce((acc: any, item) => {
                              acc[item.status] = (acc[item.status] || 0) + 1
                              return acc
                            }, {}),
                          ).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(
                            data.serviceData.reduce((acc: any, item) => {
                              acc[item.status] = (acc[item.status] || 0) + 1
                              return acc
                            }, {}),
                          ).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Service Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Services:</span>
                      <span className="font-medium">{data.serviceData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completed Services:</span>
                      <span className="font-medium">
                        {data.serviceData.filter((s) => s.status === "completed").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">In Progress:</span>
                      <span className="font-medium">
                        {data.serviceData.filter((s) => s.status === "in_progress").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Service Value:</span>
                      <span className="font-medium">
                        $
                        {(
                          data.serviceData.reduce((sum, item) => sum + (Number.parseFloat(item.total) || 0), 0) /
                          (data.serviceData.length || 1)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.employeeData
                    .sort((a, b) => Number.parseFloat(b.performance_score) - Number.parseFloat(a.performance_score))
                    .map((item) => ({
                      name: item.name,
                      performance: Number.parseFloat(item.performance_score) || 0,
                      tickets: item.tickets_completed || 0,
                      avgValue: Number.parseFloat(item.average_ticket_value) || 0,
                    }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="performance" fill="#8884d8" name="Performance Score" />
                  <Bar yAxisId="right" dataKey="tickets" fill="#82ca9d" name="Tickets Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Employee Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(
                            data.employeeData.reduce((acc: any, item) => {
                              acc[item.role] = (acc[item.role] || 0) + 1
                              return acc
                            }, {}),
                          ).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(
                            data.employeeData.reduce((acc: any, item) => {
                              acc[item.role] = (acc[item.role] || 0) + 1
                              return acc
                            }, {}),
                          ).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Employee Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Employees:</span>
                      <span className="font-medium">{data.employeeData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Performance:</span>
                      <span className="font-medium">
                        {(
                          data.employeeData.reduce(
                            (sum, item) => sum + (Number.parseFloat(item.performance_score) || 0),
                            0,
                          ) / (data.employeeData.length || 1)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Top Performers:</span>
                      <span className="font-medium">
                        {data.employeeData.filter((e) => Number.parseFloat(e.performance_score) > 80).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Tickets Completed:</span>
                      <span className="font-medium">
                        {data.employeeData.reduce((sum, item) => sum + (item.tickets_completed || 0), 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Insights
            {isGeneratingInsights && <span className="ml-2 text-sm text-muted-foreground">(Generating...)</span>}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  insight.type === "positive"
                    ? "border-l-green-500"
                    : insight.type === "negative"
                      ? "border-l-red-500"
                      : "border-l-blue-500"
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{insight.description}</p>
                  {insight.metric && insight.value !== undefined && (
                    <div className="mt-2 flex items-center">
                      <span className="text-sm font-medium">
                        {insight.metric}: {insight.value}
                      </span>
                      {insight.change !== undefined && (
                        <span
                          className={`ml-2 text-xs ${
                            insight.change > 0
                              ? "text-green-500"
                              : insight.change < 0
                                ? "text-red-500"
                                : "text-gray-500"
                          }`}
                        >
                          {insight.change > 0 ? "↑" : insight.change < 0 ? "↓" : "→"}
                          {Math.abs(insight.change).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-sm text-muted-foreground">Data updated: {new Date().toLocaleString()}</p>
        <Button variant="outline" size="sm" onClick={() => generateInsights(data)}>
          <Brain className="mr-2 h-4 w-4" />
          Regenerate Insights
        </Button>
      </CardFooter>
    </Card>
  )
}

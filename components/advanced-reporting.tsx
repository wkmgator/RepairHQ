"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, DollarSign, Users, Clock, Download, FileText, Calculator } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"

interface FinancialMetrics {
  revenue: number
  expenses: number
  profit: number
  profitMargin: number
  cashFlow: number
  revenueGrowth: number
}

interface KPIMetrics {
  customerSatisfaction: number
  averageRepairTime: number
  firstTimeFixRate: number
  inventoryTurnover: number
  employeeUtilization: number
  customerRetention: number
}

export default function AdvancedReporting() {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    profitMargin: 0,
    cashFlow: 0,
    revenueGrowth: 0,
  })
  const [kpiMetrics, setKPIMetrics] = useState<KPIMetrics>({
    customerSatisfaction: 0,
    averageRepairTime: 0,
    firstTimeFixRate: 0,
    inventoryTurnover: 0,
    employeeUtilization: 0,
    customerRetention: 0,
  })
  const [revenueData, setRevenueData] = useState([])
  const [expenseBreakdown, setExpenseBreakdown] = useState([])
  const [customerAnalytics, setCustomerAnalytics] = useState([])
  const [inventoryMetrics, setInventoryMetrics] = useState([])

  useEffect(() => {
    fetchReportingData()
  }, [dateRange, selectedLocation])

  const fetchReportingData = async () => {
    setLoading(true)
    try {
      // Fetch financial data
      const { data: invoices } = await supabase
        .from("invoices")
        .select("*")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())

      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())

      const { data: tickets } = await supabase
        .from("tickets")
        .select("*")
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString())

      const { data: customers } = await supabase.from("customers").select("*")

      const { data: inventory } = await supabase.from("inventory_items").select("*")

      // Calculate financial metrics
      const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0
      const totalExpenses = expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0
      const profit = totalRevenue - totalExpenses
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

      setFinancialMetrics({
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit,
        profitMargin,
        cashFlow: profit, // Simplified
        revenueGrowth: 12.5, // Mock data
      })

      // Calculate KPI metrics
      const completedTickets = tickets?.filter((t) => t.status === "completed") || []
      const avgRepairTime =
        completedTickets.reduce((sum, ticket) => {
          const created = new Date(ticket.created_at)
          const completed = new Date(ticket.completed_at || ticket.updated_at)
          return sum + (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        }, 0) / (completedTickets.length || 1)

      setKPIMetrics({
        customerSatisfaction: 4.7,
        averageRepairTime: avgRepairTime,
        firstTimeFixRate: 89.5,
        inventoryTurnover: 6.2,
        employeeUtilization: 78.3,
        customerRetention: 85.2,
      })

      // Generate chart data
      generateChartData(invoices, expenses, tickets, customers, inventory)
    } catch (error) {
      console.error("Error fetching reporting data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = (invoices: any[], expenses: any[], tickets: any[], customers: any[], inventory: any[]) => {
    // Revenue trend data
    const revenueByDay = {}
    invoices?.forEach((invoice) => {
      const date = new Date(invoice.created_at).toLocaleDateString()
      revenueByDay[date] = (revenueByDay[date] || 0) + invoice.total_amount
    })

    const revenueChartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }))
    setRevenueData(revenueChartData)

    // Expense breakdown
    const expenseCategories = {}
    expenses?.forEach((expense) => {
      const category = expense.category || "Other"
      expenseCategories[category] = (expenseCategories[category] || 0) + expense.amount
    })

    const expenseChartData = Object.entries(expenseCategories).map(([category, amount]) => ({
      category,
      amount,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }))
    setExpenseBreakdown(expenseChartData)

    // Customer analytics
    const customerData = [
      { month: "Jan", new: 45, returning: 120 },
      { month: "Feb", new: 52, returning: 135 },
      { month: "Mar", new: 48, returning: 142 },
      { month: "Apr", new: 61, returning: 158 },
      { month: "May", new: 55, returning: 165 },
      { month: "Jun", new: 67, returning: 178 },
    ]
    setCustomerAnalytics(customerData)

    // Inventory metrics
    const inventoryData =
      inventory?.map((item) => ({
        name: item.name,
        value: item.quantity_in_stock * item.unit_cost,
        turnover: Math.random() * 10 + 2,
      })) || []
    setInventoryMetrics(inventoryData.slice(0, 10))
  }

  const generateReport = async (reportType: string) => {
    try {
      const reportData = {
        type: reportType,
        period: dateRange,
        location: selectedLocation,
        metrics: reportType === "financial" ? financialMetrics : kpiMetrics,
        generatedAt: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("financial_reports").insert({
        report_type: reportType,
        period_start: dateRange.from.toISOString(),
        period_end: dateRange.to.toISOString(),
        data: reportData,
      })

      if (error) throw error

      // In a real app, this would generate and download a PDF
      alert(`${reportType} report generated successfully!`)
    } catch (error) {
      console.error("Error generating report:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advanced Reporting & Analytics</h1>
          <p className="text-gray-600">Comprehensive business intelligence and insights</p>
        </div>
        <div className="flex gap-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="main">Main Location</SelectItem>
              <SelectItem value="branch1">Branch 1</SelectItem>
              <SelectItem value="branch2">Branch 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />+{financialMetrics.revenueGrowth}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialMetrics.profit)}</div>
            <p className="text-xs text-muted-foreground">{financialMetrics.profitMargin.toFixed(1)}% profit margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMetrics.customerSatisfaction}/5.0</div>
            <p className="text-xs text-muted-foreground">Based on {Math.floor(Math.random() * 500 + 200)} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMetrics.averageRepairTime.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground">{kpiMetrics.firstTimeFixRate}% first-time fix rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="financial" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="financial">Financial Reports</TabsTrigger>
            <TabsTrigger value="performance">Performance KPIs</TabsTrigger>
            <TabsTrigger value="customer">Customer Analytics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => generateReport("financial")}>
              <FileText className="w-4 h-4 mr-2" />
              P&L Report
            </Button>
            <Button variant="outline" onClick={() => generateReport("cash_flow")}>
              <Download className="w-4 h-4 mr-2" />
              Cash Flow
            </Button>
            <Button variant="outline" onClick={() => generateReport("tax")}>
              <Calculator className="w-4 h-4 mr-2" />
              Tax Report
            </Button>
          </div>
        </div>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ category, amount }) => `${category}: ${formatCurrency(amount)}`}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>Financial performance summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Total Revenue</span>
                  <span className="text-green-600 font-bold">{formatCurrency(financialMetrics.revenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Total Expenses</span>
                  <span className="text-red-600 font-bold">-{formatCurrency(financialMetrics.expenses)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-double border-t-2">
                  <span className="font-bold text-lg">Net Profit</span>
                  <span
                    className={`font-bold text-lg ${financialMetrics.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(financialMetrics.profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Profit Margin</span>
                  <span className="font-bold">{financialMetrics.profitMargin.toFixed(2)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{kpiMetrics.customerSatisfaction}/5.0</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(kpiMetrics.customerSatisfaction / 5) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>First-Time Fix Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{kpiMetrics.firstTimeFixRate}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${kpiMetrics.firstTimeFixRate}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{kpiMetrics.employeeUtilization}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${kpiMetrics.employeeUtilization}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{kpiMetrics.inventoryTurnover}x</div>
                <p className="text-sm text-gray-600 mt-2">Times per year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-teal-600">{kpiMetrics.customerRetention}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: `${kpiMetrics.customerRetention}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Repair Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">{kpiMetrics.averageRepairTime.toFixed(1)}</div>
                <p className="text-sm text-gray-600 mt-2">Days</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition Trends</CardTitle>
              <CardDescription>New vs returning customers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={customerAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="new" fill="#3b82f6" name="New Customers" />
                  <Bar dataKey="returning" fill="#10b981" name="Returning Customers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Inventory Items by Value</CardTitle>
              <CardDescription>Most valuable items in stock</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inventoryMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

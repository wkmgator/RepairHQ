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
import { Download, RefreshCw, DollarSign, AlertTriangle } from "lucide-react"

export default function FinancialReports() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("revenue")
  const [dateRange, setDateRange] = useState("30days")
  const [refreshKey, setRefreshKey] = useState(0)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const supabase = createClient()

        // Fetch transactions data
        const { data: transactionsData, error: transactionsError } = await supabase
          .from("transactions")
          .select("id, created_at, total, payment_method, customer_id, items, tax, discount")
          .order("created_at", { ascending: false })
          .limit(500)

        if (transactionsError) throw new Error(`Error fetching transactions: ${transactionsError.message}`)

        // Fetch expenses data
        const { data: expensesData, error: expensesError } = await supabase
          .from("expenses")
          .select("id, created_at, amount, category, description, payment_method")
          .order("created_at", { ascending: false })
          .limit(500)

        if (expensesError) throw new Error(`Error fetching expenses: ${expensesError.message}`)

        // Fetch invoices data
        const { data: invoicesData, error: invoicesError } = await supabase
          .from("invoices")
          .select("id, created_at, total, status, due_date, customer_id")
          .order("created_at", { ascending: false })
          .limit(500)

        if (invoicesError) throw new Error(`Error fetching invoices: ${invoicesError.message}`)

        // Process data based on date range
        const filteredTransactions = processDateRange(transactionsData || [], dateRange)
        const filteredExpenses = processDateRange(expensesData || [], dateRange)
        const filteredInvoices = processDateRange(invoicesData || [], dateRange)

        // Calculate financial metrics
        const totalRevenue = filteredTransactions.reduce((sum, item) => sum + (Number.parseFloat(item.total) || 0), 0)
        const totalExpenses = filteredExpenses.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0)
        const totalProfit = totalRevenue - totalExpenses
        const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

        // Calculate revenue by day/week/month
        const revenueByPeriod = calculateRevenueByPeriod(filteredTransactions, dateRange)
        const expensesByPeriod = calculateExpensesByPeriod(filteredExpenses, dateRange)

        // Calculate revenue by payment method
        const revenueByPaymentMethod = filteredTransactions.reduce((acc: any, item) => {
          acc[item.payment_method] = (acc[item.payment_method] || 0) + (Number.parseFloat(item.total) || 0)
          return acc
        }, {})

        // Calculate expenses by category
        const expensesByCategory = filteredExpenses.reduce((acc: any, item) => {
          acc[item.category] = (acc[item.category] || 0) + (Number.parseFloat(item.amount) || 0)
          return acc
        }, {})

        // Calculate invoice status
        const invoiceStatus = filteredInvoices.reduce((acc: any, item) => {
          acc[item.status] = (acc[item.status] || 0) + (Number.parseFloat(item.total) || 0)
          return acc
        }, {})

        // Calculate accounts receivable aging
        const arAging = calculateARaging(filteredInvoices)

        setData({
          totalRevenue,
          totalExpenses,
          totalProfit,
          profitMargin,
          revenueByPeriod,
          expensesByPeriod,
          revenueByPaymentMethod,
          expensesByCategory,
          invoiceStatus,
          arAging,
          transactions: filteredTransactions,
          expenses: filteredExpenses,
          invoices: filteredInvoices,
        })
      } catch (err: any) {
        console.error("Error fetching financial data:", err)
        setError(err.message || "Failed to load financial data")
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

  const calculateRevenueByPeriod = (transactions: any[], range: string) => {
    const result: any[] = []
    const periodMap: Record<string, number> = {}

    let dateFormat: string
    let periodType: string

    switch (range) {
      case "7days":
        dateFormat = "MM/dd"
        periodType = "day"
        break
      case "90days":
        dateFormat = "MM/yyyy"
        periodType = "week"
        break
      case "1year":
        dateFormat = "MM/yyyy"
        periodType = "month"
        break
      case "30days":
      default:
        dateFormat = "MM/dd"
        periodType = "day"
        break
    }

    transactions.forEach((transaction) => {
      const date = new Date(transaction.created_at)
      let periodKey: string

      if (periodType === "day") {
        periodKey = `${date.getMonth() + 1}/${date.getDate()}`
      } else if (periodType === "week") {
        const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)
        periodKey = `Week ${weekNumber}, ${date.getMonth() + 1}/${date.getFullYear()}`
      } else {
        periodKey = `${date.getMonth() + 1}/${date.getFullYear()}`
      }

      periodMap[periodKey] = (periodMap[periodKey] || 0) + (Number.parseFloat(transaction.total) || 0)
    })

    Object.entries(periodMap).forEach(([period, amount]) => {
      result.push({ period, amount })
    })

    return result.sort((a, b) => {
      // Sort by date for proper chronological order
      const [aMonth, aDay] = a.period.split("/").map(Number)
      const [bMonth, bDay] = b.period.split("/").map(Number)

      if (aMonth !== bMonth) return aMonth - bMonth
      return aDay - bDay
    })
  }

  const calculateExpensesByPeriod = (expenses: any[], range: string) => {
    const result: any[] = []
    const periodMap: Record<string, number> = {}

    let dateFormat: string
    let periodType: string

    switch (range) {
      case "7days":
        dateFormat = "MM/dd"
        periodType = "day"
        break
      case "90days":
        dateFormat = "MM/yyyy"
        periodType = "week"
        break
      case "1year":
        dateFormat = "MM/yyyy"
        periodType = "month"
        break
      case "30days":
      default:
        dateFormat = "MM/dd"
        periodType = "day"
        break
    }

    expenses.forEach((expense) => {
      const date = new Date(expense.created_at)
      let periodKey: string

      if (periodType === "day") {
        periodKey = `${date.getMonth() + 1}/${date.getDate()}`
      } else if (periodType === "week") {
        const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)
        periodKey = `Week ${weekNumber}, ${date.getMonth() + 1}/${date.getFullYear()}`
      } else {
        periodKey = `${date.getMonth() + 1}/${date.getFullYear()}`
      }

      periodMap[periodKey] = (periodMap[periodKey] || 0) + (Number.parseFloat(expense.amount) || 0)
    })

    Object.entries(periodMap).forEach(([period, amount]) => {
      result.push({ period, amount })
    })

    return result.sort((a, b) => {
      // Sort by date for proper chronological order
      const [aMonth, aDay] = a.period.split("/").map(Number)
      const [bMonth, bDay] = b.period.split("/").map(Number)

      if (aMonth !== bMonth) return aMonth - bMonth
      return aDay - bDay
    })
  }

  const calculateARaging = (invoices: any[]) => {
    const now = new Date()
    const result = {
      current: 0,
      "1-30": 0,
      "31-60": 0,
      "61-90": 0,
      "90+": 0,
    }

    invoices.forEach((invoice) => {
      if (invoice.status === "paid") return

      const dueDate = new Date(invoice.due_date)
      const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 0) {
        result.current += Number.parseFloat(invoice.total) || 0
      } else if (daysDiff <= 30) {
        result["1-30"] += Number.parseFloat(invoice.total) || 0
      } else if (daysDiff <= 60) {
        result["31-60"] += Number.parseFloat(invoice.total) || 0
      } else if (daysDiff <= 90) {
        result["61-90"] += Number.parseFloat(invoice.total) || 0
      } else {
        result["90+"] += Number.parseFloat(invoice.total) || 0
      }
    })

    return result
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleExport = () => {
    if (!data) return

    const exportData = {
      generatedAt: new Date().toISOString(),
      dateRange,
      financialData: data,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `repairhq-financial-report-${dateRange}-${new Date().toISOString().split("T")[0]}.json`
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
            <DollarSign className="h-5 w-5" />
            <Skeleton className="h-8 w-64" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            Financial Report Error
          </CardTitle>
          <CardDescription>There was a problem loading the financial data</CardDescription>
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
          <CardTitle>No Financial Data Available</CardTitle>
          <CardDescription>There is no financial data to display</CardDescription>
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
          <DollarSign className="h-5 w-5" />
          Financial Reports
        </CardTitle>
        <CardDescription>Comprehensive financial analysis and reporting for your repair business</CardDescription>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">From {data.transactions.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">From {data.expenses.length} expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalProfit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Profit Margin: {data.profitMargin.toFixed(2)}%</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
            <TabsTrigger value="ar">Accounts Receivable</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenueByPeriod} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Revenue by Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(data.revenueByPaymentMethod).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(data.revenueByPaymentMethod).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Revenue Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue:</span>
                      <span className="font-medium">${data.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Transaction:</span>
                      <span className="font-medium">
                        ${(data.totalRevenue / (data.transactions.length || 1)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transaction Count:</span>
                      <span className="font-medium">{data.transactions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Highest Transaction:</span>
                      <span className="font-medium">
                        ${Math.max(...data.transactions.map((t: any) => Number.parseFloat(t.total) || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.expensesByPeriod} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Expenses"]} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#FF8042" activeDot={{ r: 8 }} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(data.expensesByCategory).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(data.expensesByCategory).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Expense Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Expenses:</span>
                      <span className="font-medium">${data.totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Expense:</span>
                      <span className="font-medium">
                        ${(data.totalExpenses / (data.expenses.length || 1)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expense Count:</span>
                      <span className="font-medium">{data.expenses.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Highest Expense:</span>
                      <span className="font-medium">
                        ${Math.max(...data.expenses.map((e: any) => Number.parseFloat(e.amount) || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profit" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.revenueByPeriod.map((item: any) => {
                    const expenseItem = data.expensesByPeriod.find((e: any) => e.period === item.period)
                    const expenseAmount = expenseItem ? expenseItem.amount : 0
                    return {
                      period: item.period,
                      revenue: item.amount,
                      expenses: expenseAmount,
                      profit: item.amount - expenseAmount,
                    }
                  })}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                  <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Profit Margin Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data.revenueByPeriod.map((item: any) => {
                          const expenseItem = data.expensesByPeriod.find((e: any) => e.period === item.period)
                          const expenseAmount = expenseItem ? expenseItem.amount : 0
                          const profit = item.amount - expenseAmount
                          const margin = item.amount > 0 ? (profit / item.amount) * 100 : 0
                          return {
                            period: item.period,
                            margin: margin,
                          }
                        })}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, "Profit Margin"]} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="margin"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                          name="Profit Margin %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Profit & Loss Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue:</span>
                      <span className="font-medium">${data.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Expenses:</span>
                      <span className="font-medium">${data.totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Net Profit:</span>
                      <span className="font-medium">${data.totalProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profit Margin:</span>
                      <span className="font-medium">{data.profitMargin.toFixed(2)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ar" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(data.arAging).map(([age, amount]) => ({ age, amount }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" name="Amount Due" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Invoice Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(data.invoiceStatus).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(data.invoiceStatus).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Accounts Receivable Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current:</span>
                      <span className="font-medium">${data.arAging.current.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">1-30 Days:</span>
                      <span className="font-medium">${data.arAging["1-30"].toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">31-60 Days:</span>
                      <span className="font-medium">${data.arAging["31-60"].toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">61-90 Days:</span>
                      <span className="font-medium">${data.arAging["61-90"].toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">90+ Days:</span>
                      <span className="font-medium">${data.arAging["90+"].toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Total Outstanding:</span>
                      <span className="font-medium">
                        $
                        {(
                          data.arAging.current +
                          data.arAging["1-30"] +
                          data.arAging["31-60"] +
                          data.arAging["61-90"] +
                          data.arAging["90+"]
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-sm text-muted-foreground">Data updated: {new Date().toLocaleString()}</p>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </CardFooter>
    </Card>
  )
}

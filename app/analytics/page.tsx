"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Invoice, Ticket, Customer, InventoryItem, Employee } from "@/lib/firestore-types"
import { AdvancedAnalyticsDashboardComplete } from "@/components/advanced-analytics-dashboard-complete"
import { CustomReportBuilder } from "@/components/custom-report-builder"
import { BarChart3, FileText, Settings } from "lucide-react"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30")
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 0,
      growth: 0,
      monthlyData: [] as any[],
    },
    tickets: {
      total: 0,
      completed: 0,
      pending: 0,
      avgCompletionTime: 0,
      statusData: [] as any[],
    },
    customers: {
      total: 0,
      new: 0,
      returning: 0,
      topCustomers: [] as any[],
    },
    inventory: {
      totalValue: 0,
      lowStock: 0,
      topItems: [] as any[],
    },
    employees: {
      total: 0,
      productivity: [] as any[],
    },
  })

  useEffect(() => {
    if (!user?.uid) return
    fetchAnalytics()
  }, [user?.uid, timeRange])

  const fetchAnalytics = async () => {
    if (!user?.uid) return

    setLoading(true)
    try {
      const days = Number.parseInt(timeRange)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Fetch invoices
      const invoicesQuery = query(
        collection(db, "invoices"),
        where("userId", "==", user.uid),
        where("createdAt", ">=", startDate),
      )
      const invoicesSnapshot = await getDocs(invoicesQuery)
      const invoices = invoicesSnapshot.docs.map((doc) => ({ invoiceId: doc.id, ...doc.data() })) as Invoice[]

      // Fetch tickets
      const ticketsQuery = query(
        collection(db, "tickets"),
        where("userId", "==", user.uid),
        where("createdAt", ">=", startDate),
      )
      const ticketsSnapshot = await getDocs(ticketsQuery)
      const tickets = ticketsSnapshot.docs.map((doc) => ({ ticketId: doc.id, ...doc.data() })) as Ticket[]

      // Fetch customers
      const customersQuery = query(collection(db, "customers"), where("userId", "==", user.uid))
      const customersSnapshot = await getDocs(customersQuery)
      const customers = customersSnapshot.docs.map((doc) => ({ customerId: doc.id, ...doc.data() })) as Customer[]

      // Fetch inventory
      const inventoryQuery = query(collection(db, "inventory"), where("userId", "==", user.uid))
      const inventorySnapshot = await getDocs(inventoryQuery)
      const inventory = inventorySnapshot.docs.map((doc) => ({ itemId: doc.id, ...doc.data() })) as InventoryItem[]

      // Fetch employees
      const employeesQuery = query(collection(db, "employees"), where("userId", "==", user.uid))
      const employeesSnapshot = await getDocs(employeesQuery)
      const employees = employeesSnapshot.docs.map((doc) => ({ employeeId: doc.id, ...doc.data() })) as Employee[]

      // Calculate analytics
      const revenueAnalytics = calculateRevenueAnalytics(invoices, days)
      const ticketAnalytics = calculateTicketAnalytics(tickets)
      const customerAnalytics = calculateCustomerAnalytics(customers, invoices, startDate)
      const inventoryAnalytics = calculateInventoryAnalytics(inventory)
      const employeeAnalytics = calculateEmployeeAnalytics(employees, tickets)

      setAnalytics({
        revenue: revenueAnalytics,
        tickets: ticketAnalytics,
        customers: customerAnalytics,
        inventory: inventoryAnalytics,
        employees: employeeAnalytics,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateRevenueAnalytics = (invoices: Invoice[], days: number) => {
    const paidInvoices = invoices.filter((inv) => inv.status === "paid")
    const total = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

    // Calculate monthly data for chart
    const monthlyData = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayRevenue = paidInvoices
        .filter((inv) => {
          const invDate = new Date(inv.paidDate?.seconds * 1000 || inv.createdAt.seconds * 1000)
          return invDate.toDateString() === date.toDateString()
        })
        .reduce((sum, inv) => sum + inv.totalAmount, 0)

      monthlyData.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: dayRevenue,
      })
    }

    return {
      total,
      growth: 12.5, // Mock growth percentage
      monthlyData,
    }
  }

  const calculateTicketAnalytics = (tickets: Ticket[]) => {
    const total = tickets.length
    const completed = tickets.filter((t) => t.status === "completed").length
    const pending = tickets.filter((t) => t.status === "pending").length

    const statusData = [
      { name: "Completed", value: completed, color: "#10b981" },
      { name: "In Progress", value: tickets.filter((t) => t.status === "in_progress").length, color: "#3b82f6" },
      { name: "Pending", value: pending, color: "#f59e0b" },
      { name: "Cancelled", value: tickets.filter((t) => t.status === "cancelled").length, color: "#ef4444" },
    ]

    return {
      total,
      completed,
      pending,
      avgCompletionTime: 2.5, // Mock average days
      statusData,
    }
  }

  const calculateCustomerAnalytics = (customers: Customer[], invoices: Invoice[], startDate: Date) => {
    const total = customers.length
    const newCustomers = customers.filter((c) => new Date(c.createdAt.seconds * 1000) >= startDate).length

    const topCustomers = customers
      .map((customer) => {
        const customerInvoices = invoices.filter((inv) => inv.customerId === customer.customerId)
        const totalSpent = customerInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
        return {
          name: `${customer.firstName} ${customer.lastName}`,
          totalSpent,
          invoiceCount: customerInvoices.length,
        }
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)

    return {
      total,
      new: newCustomers,
      returning: total - newCustomers,
      topCustomers,
    }
  }

  const calculateInventoryAnalytics = (inventory: InventoryItem[]) => {
    const activeItems = inventory.filter((item) => item.isActive)
    const totalValue = activeItems.reduce((sum, item) => sum + item.quantity * item.costPrice, 0)
    const lowStock = activeItems.filter((item) => item.quantity <= item.minStockLevel).length

    const topItems = activeItems
      .sort((a, b) => b.quantity * b.costPrice - a.quantity * a.costPrice)
      .slice(0, 5)
      .map((item) => ({
        name: item.name,
        value: item.quantity * item.costPrice,
        quantity: item.quantity,
      }))

    return {
      totalValue,
      lowStock,
      topItems,
    }
  }

  const calculateEmployeeAnalytics = (employees: Employee[], tickets: Ticket[]) => {
    const activeEmployees = employees.filter((emp) => emp.isActive)
    const productivity = activeEmployees.map((emp) => {
      const empTickets = tickets.filter((t) => t.assignedTechnician === emp.employeeId)
      return {
        name: `${emp.firstName} ${emp.lastName}`,
        tickets: empTickets.length,
        completed: empTickets.filter((t) => t.status === "completed").length,
      }
    })

    return {
      total: activeEmployees.length,
      productivity,
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
    <div className="container mx-auto p-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Custom Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdvancedAnalyticsDashboardComplete analytics={analytics} />
        </TabsContent>

        <TabsContent value="reports">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Settings</h3>
            <p className="mt-1 text-sm text-gray-500">Configure analytics preferences and data retention policies.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Eye, Edit, Clock, Wrench, AlertTriangle, CheckCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface WorkOrder {
  id: string
  order_number: string
  customer_id: string
  device_info: string
  description: string
  status: string
  priority: string
  estimated_cost: number
  created_at: string
  updated_at: string
  due_date: string | null
  assigned_to: string | null
  customer_name?: string
}

export default function WorkOrdersPage() {
  const { user } = useAuth()
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    if (!user?.id) return

    const fetchWorkOrders = async () => {
      try {
        // Get work orders
        const { data: workOrdersData, error: workOrdersError } = await supabase
          .from("work_orders")
          .select("*")
          .order("created_at", { ascending: false })

        if (workOrdersError) throw workOrdersError

        // Get customer names for each work order
        const workOrdersWithCustomers = await Promise.all(
          (workOrdersData || []).map(async (order) => {
            const { data: customerData } = await supabase
              .from("customers")
              .select("first_name, last_name")
              .eq("id", order.customer_id)
              .single()

            return {
              ...order,
              customer_name: customerData ? `${customerData.first_name} ${customerData.last_name}` : "Unknown Customer",
            }
          }),
        )

        setWorkOrders(workOrdersWithCustomers)
        setLoading(false)
      } catch (error) {
        console.error("Error loading work orders:", error)
        setLoading(false)
      }
    }

    fetchWorkOrders()

    // Set up real-time subscription
    const workOrdersSubscription = supabase
      .channel("work-orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "work_orders",
        },
        async () => {
          const { data } = await supabase.from("work_orders").select("*").order("created_at", { ascending: false })
          setWorkOrders(data || [])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(workOrdersSubscription)
    }
  }, [user?.id])

  const filteredWorkOrders = workOrders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.device_info?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: workOrders.length,
    pending: workOrders.filter((o) => o.status === "pending").length,
    inProgress: workOrders.filter((o) => o.status === "in_progress").length,
    completed: workOrders.filter((o) => o.status === "completed").length,
    urgent: workOrders.filter((o) => o.priority === "urgent").length,
    avgValue:
      workOrders.length > 0 ? workOrders.reduce((sum, o) => sum + (o.estimated_cost || 0), 0) / workOrders.length : 0,
  }

  const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleQuickStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("work_orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (error) throw error
    } catch (error) {
      console.error("Error updating work order status:", error)
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
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-gray-600">Manage and track repair work orders</p>
        </div>
        <Link href="/work-orders/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Work Order
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.completed} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">{stats.pending} pending start</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Orders</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgValue)}</div>
            <p className="text-xs text-muted-foreground">Average repair cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search work orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Status</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs value={priorityFilter} onValueChange={setPriorityFilter} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Priority</TabsTrigger>
                  <TabsTrigger value="urgent">Urgent</TabsTrigger>
                  <TabsTrigger value="high">High</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="low">Low</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredWorkOrders.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No work orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by creating your first work order."}
              </p>
              {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
                <div className="mt-6">
                  <Link href="/work-orders/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Work Order
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Order #</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Device</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Priority</th>
                    <th className="text-left py-3 px-4 font-medium">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium">Cost</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link href={`/work-orders/${order.id}`} className="font-medium text-blue-600 hover:underline">
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{order.customer_name}</td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate" title={order.device_info}>
                          {order.device_info}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs truncate" title={order.description}>
                          {order.description}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleQuickStatusUpdate(order.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded border-0 ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="waiting_for_parts">Waiting for Parts</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPriorityColor(order.priority)}>{order.priority.toUpperCase()}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{formatDate(order.due_date)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{formatCurrency(order.estimated_cost)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/work-orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/work-orders/${order.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

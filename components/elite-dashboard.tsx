"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { EliteCard, EliteCardContent, EliteCardHeader, EliteCardTitle } from "@/components/ui/elite-card"
import { EliteButton } from "@/components/ui/elite-button"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  Calendar,
  Clock,
  Zap,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data
const revenueData = [
  { month: "Jan", revenue: 45000, orders: 120, customers: 89 },
  { month: "Feb", revenue: 52000, orders: 145, customers: 102 },
  { month: "Mar", revenue: 48000, orders: 132, customers: 95 },
  { month: "Apr", revenue: 61000, orders: 168, customers: 118 },
  { month: "May", revenue: 55000, orders: 152, customers: 108 },
  { month: "Jun", revenue: 67000, orders: 185, customers: 134 },
]

const repairTypeData = [
  { name: "Phone Repair", value: 45, color: "#3b82f6" },
  { name: "Laptop Repair", value: 25, color: "#8b5cf6" },
  { name: "Tablet Repair", value: 20, color: "#06b6d4" },
  { name: "Other", value: 10, color: "#10b981" },
]

const metrics = [
  {
    title: "Total Revenue",
    value: "$67,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    title: "Active Tickets",
    value: "185",
    change: "+8.2%",
    trend: "up",
    icon: Activity,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "New Customers",
    value: "134",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  {
    title: "Avg. Repair Time",
    value: "2.4 hrs",
    change: "-5.1%",
    trend: "down",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950",
  },
]

const recentActivity = [
  { id: 1, type: "repair", customer: "John Doe", device: "iPhone 14 Pro", status: "completed", time: "2 min ago" },
  { id: 2, type: "order", customer: "Sarah Wilson", device: "MacBook Air", status: "in-progress", time: "5 min ago" },
  { id: 3, type: "payment", customer: "Mike Johnson", device: "iPad Pro", status: "paid", time: "12 min ago" },
  { id: 4, type: "repair", customer: "Emma Davis", device: "Samsung Galaxy", status: "pending", time: "18 min ago" },
]

export function EliteDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your repair shop.</p>
        </div>
        <div className="flex gap-3">
          <EliteButton variant="outline" icon={<Calendar className="w-4 h-4" />}>
            Last 30 days
          </EliteButton>
          <EliteButton variant="gradient" icon={<Zap className="w-4 h-4" />}>
            Quick Actions
          </EliteButton>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <EliteCard key={metric.title} variant="glass" className="relative overflow-hidden">
            <EliteCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={cn("text-sm font-medium", metric.trend === "up" ? "text-green-600" : "text-red-600")}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={cn("p-3 rounded-2xl", metric.bgColor)}>
                  <metric.icon className={cn("w-6 h-6", metric.color)} />
                </div>
              </div>
            </EliteCardContent>
          </EliteCard>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EliteCard variant="glass">
            <EliteCardHeader>
              <EliteCardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Revenue Overview
              </EliteCardTitle>
            </EliteCardHeader>
            <EliteCardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </EliteCardContent>
          </EliteCard>
        </motion.div>

        {/* Repair Types Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <EliteCard variant="glass">
            <EliteCardHeader>
              <EliteCardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Repair Types
              </EliteCardTitle>
            </EliteCardHeader>
            <EliteCardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={repairTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {repairTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </EliteCardContent>
          </EliteCard>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <EliteCard variant="glass">
          <EliteCardHeader>
            <EliteCardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Recent Activity
            </EliteCardTitle>
          </EliteCardHeader>
          <EliteCardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.type === "repair" && <Activity className="w-5 h-5 text-primary" />}
                      {activity.type === "order" && <ShoppingCart className="w-5 h-5 text-primary" />}
                      {activity.type === "payment" && <DollarSign className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.customer}</p>
                      <p className="text-sm text-muted-foreground">{activity.device}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : activity.status === "in-progress"
                            ? "secondary"
                            : activity.status === "paid"
                              ? "default"
                              : "outline"
                      }
                      className="mb-1"
                    >
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </EliteCardContent>
        </EliteCard>
      </motion.div>
    </div>
  )
}

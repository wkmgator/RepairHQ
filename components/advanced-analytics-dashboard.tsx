"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
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
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Star, Target, Zap, Download } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 12500, repairs: 145, customers: 89 },
  { month: "Feb", revenue: 15200, repairs: 167, customers: 102 },
  { month: "Mar", revenue: 18900, repairs: 198, customers: 125 },
  { month: "Apr", revenue: 16800, repairs: 178, customers: 115 },
  { month: "May", revenue: 21300, repairs: 234, customers: 145 },
  { month: "Jun", revenue: 19600, repairs: 212, customers: 132 },
]

const serviceTypeData = [
  { name: "Screen Repair", value: 35, color: "#8884d8" },
  { name: "Battery Replacement", value: 25, color: "#82ca9d" },
  { name: "Water Damage", value: 20, color: "#ffc658" },
  { name: "Software Issues", value: 15, color: "#ff7300" },
  { name: "Other", value: 5, color: "#00ff00" },
]

const customerSatisfactionData = [
  { week: "Week 1", satisfaction: 4.2, reviews: 23 },
  { week: "Week 2", satisfaction: 4.5, reviews: 31 },
  { week: "Week 3", satisfaction: 4.3, reviews: 28 },
  { week: "Week 4", satisfaction: 4.7, reviews: 35 },
]

const kpiData = [
  {
    title: "Revenue Growth",
    value: "+23.5%",
    change: "+5.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Customer Retention",
    value: "87.3%",
    change: "+2.1%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Avg. Repair Time",
    value: "2.4 hrs",
    change: "-0.3 hrs",
    trend: "down",
    icon: Clock,
    color: "text-purple-600",
  },
  {
    title: "Customer Rating",
    value: "4.6/5",
    change: "+0.2",
    trend: "up",
    icon: Star,
    color: "text-yellow-600",
  },
]

export function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive business insights and metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs flex items-center ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {kpi.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {kpi.change} from last period
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and repair volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
                <CardDescription>Breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Weekly average ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={customerSatisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfaction" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key operational indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>First-time Fix Rate</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>On-time Completion</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Customer Return Rate</span>
                    <span>15%</span>
                  </div>
                  <Progress value={15} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Warranty Claims</span>
                    <span>3%</span>
                  </div>
                  <Progress value={3} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>This month's leaders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-gold" />
                    <span className="text-sm">Mike Johnson</span>
                  </div>
                  <Badge variant="outline">45 repairs</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Alex Chen</span>
                  </div>
                  <Badge variant="outline">4.9 rating</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Emma Thompson</span>
                  </div>
                  <Badge variant="outline">1.8h avg</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Detailed revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                    <Bar dataKey="repairs" fill="#82ca9d" name="Repairs" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Screen Repairs</span>
                      <span className="font-medium">$8,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Battery Replacement</span>
                      <span className="font-medium">$3,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Water Damage</span>
                      <span className="font-medium">$5,100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$127.50</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline mr-1 h-3 w-3 text-green-600" />
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68.5%</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline mr-1 h-3 w-3 text-green-600" />
                    +2.1% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

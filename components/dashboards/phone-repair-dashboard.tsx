"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Smartphone, Battery, Shield, Wrench, TrendingUp, AlertTriangle, Clock, DollarSign } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const repairTrends = [
  { month: "Jan", screenRepairs: 45, batteryRepairs: 23, waterDamage: 12 },
  { month: "Feb", screenRepairs: 52, batteryRepairs: 28, waterDamage: 15 },
  { month: "Mar", screenRepairs: 48, batteryRepairs: 31, waterDamage: 18 },
  { month: "Apr", screenRepairs: 61, batteryRepairs: 35, waterDamage: 14 },
  { month: "May", screenRepairs: 55, batteryRepairs: 29, waterDamage: 16 },
  { month: "Jun", screenRepairs: 67, batteryRepairs: 42, waterDamage: 19 },
]

const deviceBreakdown = [
  { name: "iPhone", value: 45, color: "#3b82f6" },
  { name: "Samsung", value: 30, color: "#10b981" },
  { name: "Google Pixel", value: 15, color: "#f59e0b" },
  { name: "Other", value: 10, color: "#6b7280" },
]

const lowStockParts = [
  { part: "iPhone 14 Screen", current: 3, minimum: 10, urgency: "high" },
  { part: "Samsung S23 Battery", current: 7, minimum: 15, urgency: "medium" },
  { part: "iPhone 13 Charging Port", current: 12, minimum: 20, urgency: "low" },
  { part: "Screen Protectors", current: 25, minimum: 50, urgency: "medium" },
]

export default function PhoneRepairDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phone Repair Dashboard</h1>
          <p className="text-muted-foreground">Manage your mobile device repair business</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Smartphone className="mr-2 h-4 w-4" />
            New Repair
          </Button>
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Check IMEI
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,247</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-muted-foreground">-0.2h from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">+0.1 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Repair Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Repair Trends</CardTitle>
            <CardDescription>Monthly repair volume by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={repairTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="screenRepairs" stroke="#3b82f6" name="Screen Repairs" />
                <Line type="monotone" dataKey="batteryRepairs" stroke="#10b981" name="Battery Repairs" />
                <Line type="monotone" dataKey="waterDamage" stroke="#f59e0b" name="Water Damage" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Repairs by device brand this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Parts running low on inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockParts.map((part, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{part.part}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={(part.current / part.minimum) * 100} className="w-20" />
                      <span className="text-xs text-muted-foreground">
                        {part.current}/{part.minimum}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      part.urgency === "high" ? "destructive" : part.urgency === "medium" ? "default" : "secondary"
                    }
                  >
                    {part.urgency}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for phone repair shops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Smartphone className="mr-2 h-4 w-4" />
                Create Screen Repair Ticket
              </Button>
              <Button className="justify-start" variant="outline">
                <Battery className="mr-2 h-4 w-4" />
                Battery Replacement Service
              </Button>
              <Button className="justify-start" variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Water Damage Assessment
              </Button>
              <Button className="justify-start" variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Check Parts Inventory
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

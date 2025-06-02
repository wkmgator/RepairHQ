"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Calendar, DollarSign, TrendingUp, Clock, Truck } from "lucide-react"
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

const seasonalData = [
  { month: "Jan", mowers: 8, generators: 15, chainsaws: 12, blowers: 5 },
  { month: "Feb", mowers: 12, generators: 18, chainsaws: 15, blowers: 8 },
  { month: "Mar", mowers: 25, generators: 12, chainsaws: 18, blowers: 15 },
  { month: "Apr", mowers: 45, generators: 8, chainsaws: 22, blowers: 25 },
  { month: "May", mowers: 62, generators: 6, chainsaws: 18, blowers: 35 },
  { month: "Jun", mowers: 58, generators: 8, chainsaws: 15, blowers: 32 },
]

const pickupDelivery = [
  { customer: "Johnson Landscaping", equipment: "5x Mowers", status: "pickup_ready", days: 2 },
  { customer: "Green Thumb Services", equipment: "Chainsaw MS250", status: "in_progress", days: 1 },
  { customer: "City Parks Dept", equipment: "3x Leaf Blowers", status: "delivery_scheduled", days: 0 },
  { customer: "Miller Tree Service", equipment: "Generator 7500W", status: "pickup_ready", days: 3 },
]

const equipmentTypes = [
  { name: "Lawn Mowers", value: 45, color: "#3b82f6" },
  { name: "Generators", value: 20, color: "#10b981" },
  { name: "Chainsaws", value: 20, color: "#f59e0b" },
  { name: "Leaf Blowers", value: 15, color: "#6b7280" },
]

export default function SmallEngineDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Small Engine Repair Dashboard</h1>
          <p className="text-muted-foreground">Manage lawn equipment and small engine services</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            New Tune-Up
          </Button>
          <Button variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Schedule Pickup
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engines in Service</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">Peak season volume</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pickup/Delivery</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Scheduled this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Turnaround</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2d</div>
            <p className="text-xs text-muted-foreground">-0.8d from last season</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,450</div>
            <p className="text-xs text-muted-foreground">+42% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Seasonal Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Service Trends</CardTitle>
            <CardDescription>Equipment service volume by season</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="mowers" stroke="#3b82f6" name="Lawn Mowers" />
                <Line type="monotone" dataKey="generators" stroke="#10b981" name="Generators" />
                <Line type="monotone" dataKey="chainsaws" stroke="#f59e0b" name="Chainsaws" />
                <Line type="monotone" dataKey="blowers" stroke="#ef4444" name="Leaf Blowers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pickup/Delivery Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              Pickup & Delivery Queue
            </CardTitle>
            <CardDescription>Equipment ready for pickup or delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pickupDelivery.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.customer}</p>
                    <p className="text-xs text-muted-foreground">{item.equipment}</p>
                    <p className="text-xs text-muted-foreground">{item.days} days</p>
                  </div>
                  <Badge
                    variant={
                      item.status === "pickup_ready"
                        ? "default"
                        : item.status === "delivery_scheduled"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Equipment Types */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Distribution</CardTitle>
            <CardDescription>Small engines serviced this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={equipmentTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {equipmentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for small engine shops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Spring Tune-Up Service
              </Button>
              <Button className="justify-start" variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Schedule Equipment Pickup
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Seasonal Prep Reminder
              </Button>
              <Button className="justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Blade Sharpening Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

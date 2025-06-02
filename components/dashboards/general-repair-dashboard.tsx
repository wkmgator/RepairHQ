"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, Plus, Calendar, DollarSign, Clock, Users } from "lucide-react"
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

const repairCategories = [
  { month: "Jan", electronics: 35, appliances: 28, tools: 22, automotive: 18 },
  { month: "Feb", electronics: 42, appliances: 32, tools: 25, automotive: 22 },
  { month: "Mar", electronics: 38, appliances: 35, tools: 28, automotive: 25 },
  { month: "Apr", electronics: 45, appliances: 38, tools: 32, automotive: 28 },
  { month: "May", electronics: 52, appliances: 42, tools: 35, automotive: 32 },
  { month: "Jun", electronics: 48, appliances: 45, tools: 38, automotive: 35 },
]

const customRepairTypes = [
  { category: "Custom Electronics", tickets: 45, avgTime: "2.5h", revenue: "$8,450" },
  { category: "Specialty Tools", tickets: 32, avgTime: "1.8h", revenue: "$5,230" },
  { category: "Vintage Equipment", tickets: 18, avgTime: "4.2h", revenue: "$6,780" },
  { category: "Industrial Devices", tickets: 25, avgTime: "3.1h", revenue: "$9,120" },
]

const serviceDistribution = [
  { name: "Electronics", value: 35, color: "#3b82f6" },
  { name: "Appliances", value: 25, color: "#10b981" },
  { name: "Tools & Equipment", value: 20, color: "#f59e0b" },
  { name: "Custom/Other", value: 20, color: "#6b7280" },
]

export default function GeneralRepairDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Universal Repair Dashboard</h1>
          <p className="text-muted-foreground">Manage all types of repair services in one platform</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Custom Repair
          </Button>
          <Button variant="outline">
            <Wrench className="mr-2 h-4 w-4" />
            Quick Diagnostic
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Multi-skilled team</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8h</div>
            <p className="text-xs text-muted-foreground">-0.5h from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,680</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Repair Category Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Repair Category Trends</CardTitle>
            <CardDescription>Monthly repair volume by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={repairCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="electronics" stroke="#3b82f6" name="Electronics" />
                <Line type="monotone" dataKey="appliances" stroke="#10b981" name="Appliances" />
                <Line type="monotone" dataKey="tools" stroke="#f59e0b" name="Tools" />
                <Line type="monotone" dataKey="automotive" stroke="#ef4444" name="Automotive" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Custom Repair Types */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Repair Categories</CardTitle>
            <CardDescription>Specialized repair services performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customRepairTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{type.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {type.tickets} tickets • {type.avgTime} avg • {type.revenue}
                    </p>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>Repair services breakdown this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceDistribution.map((entry, index) => (
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
            <CardDescription>Common tasks for universal repair shops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Device Type
              </Button>
              <Button className="justify-start" variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Multi-Category Diagnostic
              </Button>
              <Button className="justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Assign Specialist Technician
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Complex Repair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

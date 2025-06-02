"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sun, Zap, Battery, Calendar, DollarSign, AlertTriangle, Activity } from "lucide-react"
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

const systemPerformance = [
  { month: "Jan", installations: 12, maintenance: 8, repairs: 5, inspections: 15 },
  { month: "Feb", installations: 15, maintenance: 10, repairs: 7, inspections: 18 },
  { month: "Mar", installations: 18, maintenance: 12, repairs: 6, inspections: 22 },
  { month: "Apr", installations: 22, maintenance: 15, repairs: 8, inspections: 25 },
  { month: "May", installations: 28, maintenance: 18, repairs: 9, inspections: 30 },
  { month: "Jun", installations: 32, maintenance: 22, repairs: 11, inspections: 35 },
]

const systemAlerts = [
  { system: "Residential - 123 Oak St", issue: "Inverter Offline", severity: "high", kw: "8.5kW" },
  { system: "Commercial - Tech Park", issue: "Low Production", severity: "medium", kw: "50kW" },
  { system: "Residential - 456 Pine Ave", issue: "Panel Cleaning Due", severity: "low", kw: "12kW" },
  { system: "Residential - 789 Elm Dr", issue: "Optimizer Fault", severity: "medium", kw: "6.2kW" },
]

const serviceTypes = [
  { name: "Installation", value: 40, color: "#3b82f6" },
  { name: "Maintenance", value: 30, color: "#10b981" },
  { name: "Repair", value: 20, color: "#f59e0b" },
  { name: "Inspection", value: 10, color: "#6b7280" },
]

export default function SolarRepairDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Solar System Dashboard</h1>
          <p className="text-muted-foreground">Monitor and maintain solar installations</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Sun className="mr-2 h-4 w-4" />
            System Diagnostic
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systems Monitored</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8MW</div>
            <p className="text-xs text-muted-foreground">Across all systems</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,230</div>
            <p className="text-xs text-muted-foreground">+28% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
            <CardDescription>Monthly service activity breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="installations" stroke="#3b82f6" name="Installations" />
                <Line type="monotone" dataKey="maintenance" stroke="#10b981" name="Maintenance" />
                <Line type="monotone" dataKey="repairs" stroke="#f59e0b" name="Repairs" />
                <Line type="monotone" dataKey="inspections" stroke="#ef4444" name="Inspections" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              System Alerts
            </CardTitle>
            <CardDescription>Systems requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{alert.system}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.issue} • {alert.kw}
                    </p>
                  </div>
                  <Badge
                    variant={
                      alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Types */}
        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>Service types performed this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceTypes.map((entry, index) => (
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
            <CardDescription>Common tasks for solar service teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Sun className="mr-2 h-4 w-4" />
                Performance Analysis
              </Button>
              <Button className="justify-start" variant="outline">
                <Battery className="mr-2 h-4 w-4" />
                Battery System Check
              </Button>
              <Button className="justify-start" variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                Inverter Diagnostics
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Cleaning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

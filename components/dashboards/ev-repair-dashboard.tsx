"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Battery, Car, DollarSign, Activity } from "lucide-react"
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

const evServiceData = [
  { month: "Jan", battery: 15, charging: 22, software: 18, motor: 8 },
  { month: "Feb", battery: 18, charging: 25, software: 21, motor: 10 },
  { month: "Mar", battery: 22, charging: 28, software: 24, motor: 12 },
  { month: "Apr", battery: 28, charging: 35, software: 30, motor: 15 },
  { month: "May", battery: 32, charging: 42, software: 35, motor: 18 },
  { month: "Jun", battery: 35, charging: 45, software: 38, motor: 22 },
]

const batteryHealth = [
  { vehicle: "Tesla Model 3 #1247", health: 92, range: "285mi", status: "good" },
  { vehicle: "Nissan Leaf #8934", health: 78, range: "165mi", status: "fair" },
  { vehicle: "BMW i3 #5621", health: 85, range: "125mi", status: "good" },
  { vehicle: "Chevy Bolt #3456", health: 68, range: "195mi", status: "poor" },
]

const evBrands = [
  { name: "Tesla", value: 45, color: "#3b82f6" },
  { name: "Nissan", value: 25, color: "#10b981" },
  { name: "BMW", value: 15, color: "#f59e0b" },
  { name: "Other", value: 15, color: "#6b7280" },
]

export default function EVRepairDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EV Repair Dashboard</h1>
          <p className="text-muted-foreground">Manage electric vehicle service and diagnostics</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Battery Diagnostic
          </Button>
          <Button variant="outline">
            <Car className="mr-2 h-4 w-4" />
            Software Update
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EVs in Service</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">8 high-voltage certified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Health Avg</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charging Repairs</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$52,340</div>
            <p className="text-xs text-muted-foreground">+45% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* EV Service Trends */}
        <Card>
          <CardHeader>
            <CardTitle>EV Service Trends</CardTitle>
            <CardDescription>Monthly service activity by component</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evServiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="battery" stroke="#3b82f6" name="Battery Service" />
                <Line type="monotone" dataKey="charging" stroke="#10b981" name="Charging System" />
                <Line type="monotone" dataKey="software" stroke="#f59e0b" name="Software Updates" />
                <Line type="monotone" dataKey="motor" stroke="#ef4444" name="Motor Repair" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Battery Health Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-green-500" />
              Battery Health Monitor
            </CardTitle>
            <CardDescription>Current vehicles under battery assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batteryHealth.map((vehicle, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{vehicle.vehicle}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={vehicle.health} className="w-32" />
                      <span className="text-xs text-muted-foreground">{vehicle.health}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Range: {vehicle.range}</p>
                  </div>
                  <Badge
                    variant={
                      vehicle.status === "good" ? "default" : vehicle.status === "fair" ? "secondary" : "destructive"
                    }
                  >
                    {vehicle.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* EV Brand Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>EV Brand Distribution</CardTitle>
            <CardDescription>Vehicles serviced by brand this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={evBrands}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {evBrands.map((entry, index) => (
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
            <CardDescription>Common tasks for EV service centers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Battery className="mr-2 h-4 w-4" />
                Battery Health Check
              </Button>
              <Button className="justify-start" variant="outline">
                <Zap className="mr-2 h-4 w-4" />
                Charging Port Repair
              </Button>
              <Button className="justify-start" variant="outline">
                <Activity className="mr-2 h-4 w-4" />
                Motor Diagnostics
              </Button>
              <Button className="justify-start" variant="outline">
                <Car className="mr-2 h-4 w-4" />
                Software Reflash
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

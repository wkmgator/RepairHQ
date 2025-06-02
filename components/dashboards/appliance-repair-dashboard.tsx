"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Home, MapPin, Calendar, DollarSign, TrendingUp, Clock, Route } from "lucide-react"
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

const serviceCallData = [
  { month: "Jan", refrigerator: 45, washer: 32, dryer: 28, dishwasher: 22 },
  { month: "Feb", refrigerator: 52, washer: 38, dryer: 31, dishwasher: 25 },
  { month: "Mar", refrigerator: 48, washer: 35, dryer: 29, dishwasher: 23 },
  { month: "Apr", refrigerator: 55, washer: 42, dryer: 35, dishwasher: 28 },
  { month: "May", refrigerator: 62, washer: 45, dryer: 38, dishwasher: 31 },
  { month: "Jun", refrigerator: 58, washer: 48, dryer: 41, dishwasher: 34 },
]

const routeEfficiency = [
  { route: "North Zone", appointments: 8, efficiency: 92, avgTime: "45min" },
  { route: "South Zone", appointments: 6, efficiency: 88, avgTime: "52min" },
  { route: "East Zone", appointments: 7, efficiency: 95, avgTime: "38min" },
  { route: "West Zone", appointments: 5, efficiency: 85, avgTime: "58min" },
]

const applianceBreakdown = [
  { name: "Refrigerator", value: 35, color: "#3b82f6" },
  { name: "Washer/Dryer", value: 30, color: "#10b981" },
  { name: "Dishwasher", value: 20, color: "#f59e0b" },
  { name: "Oven/Range", value: 15, color: "#6b7280" },
]

export default function ApplianceRepairDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appliance Repair Dashboard</h1>
          <p className="text-muted-foreground">Manage your in-home appliance service business</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Schedule Service Call
          </Button>
          <Button variant="outline">
            <Route className="mr-2 h-4 w-4" />
            Optimize Routes
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26</div>
            <p className="text-xs text-muted-foreground">4 zones covered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,847</div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8h</div>
            <p className="text-xs text-muted-foreground">-0.3h from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Route Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Call Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Service Call Trends</CardTitle>
            <CardDescription>Monthly service calls by appliance type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={serviceCallData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="refrigerator" stroke="#3b82f6" name="Refrigerator" />
                <Line type="monotone" dataKey="washer" stroke="#10b981" name="Washer" />
                <Line type="monotone" dataKey="dryer" stroke="#f59e0b" name="Dryer" />
                <Line type="monotone" dataKey="dishwasher" stroke="#ef4444" name="Dishwasher" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Route Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Route Performance</CardTitle>
            <CardDescription>Today's service route efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeEfficiency.map((route, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{route.route}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={route.efficiency} className="w-32" />
                      <span className="text-xs text-muted-foreground">{route.efficiency}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {route.appointments} appointments • {route.avgTime} avg
                    </p>
                  </div>
                  <Badge
                    variant={route.efficiency > 90 ? "default" : route.efficiency > 85 ? "secondary" : "destructive"}
                  >
                    {route.efficiency > 90 ? "Excellent" : route.efficiency > 85 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appliance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Service Breakdown</CardTitle>
            <CardDescription>Appliance types serviced this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applianceBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {applianceBreakdown.map((entry, index) => (
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
            <CardDescription>Common tasks for appliance repair services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Emergency Service Call
              </Button>
              <Button className="justify-start" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                View Service Map
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Maintenance
              </Button>
              <Button className="justify-start" variant="outline">
                <Route className="mr-2 h-4 w-4" />
                Optimize Daily Routes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

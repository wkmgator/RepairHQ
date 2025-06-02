"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tractor, MapPin, Calendar, DollarSign, Clock, Wrench } from "lucide-react"
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

const tractorServiceData = [
  { month: "Jan", hydraulic: 15, engine: 12, pto: 8, transmission: 6 },
  { month: "Feb", hydraulic: 18, engine: 15, pto: 10, transmission: 8 },
  { month: "Mar", hydraulic: 25, engine: 22, pto: 15, transmission: 12 },
  { month: "Apr", hydraulic: 35, engine: 28, pto: 22, transmission: 18 },
  { month: "May", hydraulic: 42, engine: 35, pto: 28, transmission: 22 },
  { month: "Jun", hydraulic: 38, engine: 32, pto: 25, transmission: 20 },
]

const fieldServiceCalls = [
  { farm: "Johnson Farm", equipment: "John Deere 8320", issue: "Hydraulic Leak", urgency: "high", hours: "2,450" },
  {
    farm: "Miller Agriculture",
    equipment: "Case IH 7250",
    issue: "PTO Not Engaging",
    urgency: "medium",
    hours: "1,890",
  },
  {
    farm: "Green Valley Ranch",
    equipment: "New Holland T7.315",
    issue: "Engine Overheating",
    urgency: "high",
    hours: "3,200",
  },
  { farm: "Sunrise Farms", equipment: "Kubota M7-172", issue: "Transmission Slip", urgency: "medium", hours: "1,650" },
]

const tractorBrands = [
  { name: "John Deere", value: 40, color: "#3b82f6" },
  { name: "Case IH", value: 25, color: "#10b981" },
  { name: "New Holland", value: 20, color: "#f59e0b" },
  { name: "Kubota", value: 15, color: "#6b7280" },
]

export default function TractorRepairDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tractor Repair Dashboard</h1>
          <p className="text-muted-foreground">Manage farm equipment and field service operations</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Tractor className="mr-2 h-4 w-4" />
            Field Service Call
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Seasonal Maintenance
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment in Service</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">8 field calls today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seasonal Workload</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Peak</div>
            <p className="text-xs text-muted-foreground">Planting season</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5h</div>
            <p className="text-xs text-muted-foreground">-1.2h from last season</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$67,890</div>
            <p className="text-xs text-muted-foreground">+35% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tractor Service Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Service Trends by System</CardTitle>
            <CardDescription>Monthly repair activity by tractor system</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tractorServiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hydraulic" stroke="#3b82f6" name="Hydraulic" />
                <Line type="monotone" dataKey="engine" stroke="#10b981" name="Engine" />
                <Line type="monotone" dataKey="pto" stroke="#f59e0b" name="PTO" />
                <Line type="monotone" dataKey="transmission" stroke="#ef4444" name="Transmission" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Field Service Calls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Active Field Service Calls
            </CardTitle>
            <CardDescription>Equipment requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fieldServiceCalls.map((call, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{call.farm}</p>
                    <p className="text-xs text-muted-foreground">
                      {call.equipment} • {call.hours} hrs
                    </p>
                    <p className="text-xs text-muted-foreground">{call.issue}</p>
                  </div>
                  <Badge variant={call.urgency === "high" ? "destructive" : "default"}>{call.urgency}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tractor Brands */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment by Brand</CardTitle>
            <CardDescription>Tractor brands serviced this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tractorBrands}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {tractorBrands.map((entry, index) => (
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
            <CardDescription>Common tasks for farm equipment service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Tractor className="mr-2 h-4 w-4" />
                Emergency Field Call
              </Button>
              <Button className="justify-start" variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Hydraulic System Check
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Pre-Season Inspection
              </Button>
              <Button className="justify-start" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Schedule Farm Visit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

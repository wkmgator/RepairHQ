"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Car, Wrench, Calendar, DollarSign, TrendingUp, Clock, Users } from "lucide-react"
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

const serviceData = [
  { month: "Jan", oilChanges: 85, brakeRepairs: 32, diagnostics: 28, transmission: 15 },
  { month: "Feb", oilChanges: 92, brakeRepairs: 38, diagnostics: 31, transmission: 18 },
  { month: "Mar", oilChanges: 88, brakeRepairs: 35, diagnostics: 29, transmission: 16 },
  { month: "Apr", oilChanges: 95, brakeRepairs: 42, diagnostics: 35, transmission: 22 },
  { month: "May", oilChanges: 102, brakeRepairs: 45, diagnostics: 38, transmission: 19 },
  { month: "Jun", oilChanges: 98, brakeRepairs: 48, diagnostics: 41, transmission: 25 },
]

const bayUtilization = [
  { bay: "Bay 1", utilization: 85, status: "occupied" },
  { bay: "Bay 2", utilization: 92, status: "occupied" },
  { bay: "Bay 3", utilization: 78, status: "available" },
  { bay: "Bay 4", utilization: 88, status: "occupied" },
  { bay: "Bay 5", utilization: 65, status: "maintenance" },
]

const vehicleTypes = [
  { name: "Sedan", value: 35, color: "#3b82f6" },
  { name: "SUV", value: 28, color: "#10b981" },
  { name: "Truck", value: 22, color: "#f59e0b" },
  { name: "Van", value: 15, color: "#6b7280" },
]

export default function AutoRepairDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Auto Repair Dashboard</h1>
          <p className="text-muted-foreground">Manage your automotive service center</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Car className="mr-2 h-4 w-4" />
            New Service
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles in Service</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">4 bays occupied</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,247</div>
            <p className="text-xs text-muted-foreground">+22% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2h</div>
            <p className="text-xs text-muted-foreground">-0.5h from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Service Trends</CardTitle>
            <CardDescription>Monthly service volume by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="oilChanges" stroke="#3b82f6" name="Oil Changes" />
                <Line type="monotone" dataKey="brakeRepairs" stroke="#10b981" name="Brake Repairs" />
                <Line type="monotone" dataKey="diagnostics" stroke="#f59e0b" name="Diagnostics" />
                <Line type="monotone" dataKey="transmission" stroke="#ef4444" name="Transmission" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bay Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Service Bay Status</CardTitle>
            <CardDescription>Current bay utilization and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bayUtilization.map((bay, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{bay.bay}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={bay.utilization} className="w-32" />
                      <span className="text-xs text-muted-foreground">{bay.utilization}%</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      bay.status === "occupied" ? "destructive" : bay.status === "available" ? "default" : "secondary"
                    }
                  >
                    {bay.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Vehicle Types */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Types Serviced</CardTitle>
            <CardDescription>Breakdown by vehicle type this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {vehicleTypes.map((entry, index) => (
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
            <CardDescription>Common tasks for auto repair shops</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Car className="mr-2 h-4 w-4" />
                VIN Lookup & Diagnostics
              </Button>
              <Button className="justify-start" variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Schedule Oil Change
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Multi-Point Inspection
              </Button>
              <Button className="justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Assign Technician
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

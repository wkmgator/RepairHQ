"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plane,
  Shield,
  AlertTriangle,
  Wrench,
  TrendingUp,
  Clock,
  DollarSign,
  Plus,
  FileText,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const helicopterMaintenanceData = [
  { month: "Jan", scheduled: 8, unscheduled: 12, inspections: 10, overhauls: 2 },
  { month: "Feb", scheduled: 10, unscheduled: 9, inspections: 12, overhauls: 3 },
  { month: "Mar", scheduled: 12, unscheduled: 15, inspections: 14, overhauls: 1 },
  { month: "Apr", scheduled: 14, unscheduled: 11, inspections: 16, overhauls: 4 },
  { month: "May", scheduled: 11, unscheduled: 13, inspections: 13, overhauls: 2 },
  { month: "Jun", scheduled: 16, unscheduled: 18, inspections: 18, overhauls: 5 },
]

const helicopterTypes = [
  { type: "Robinson R44", count: 15, avgCost: 8500, flightHours: 2400 },
  { type: "Bell 206", count: 12, avgCost: 12000, flightHours: 1800 },
  { type: "Eurocopter AS350", count: 8, avgCost: 18000, flightHours: 2100 },
  { type: "Bell 407", count: 6, avgCost: 22000, flightHours: 1500 },
  { type: "Sikorsky S-76", count: 3, avgCost: 35000, flightHours: 1200 },
]

const rotorcraftCompliance = [
  { item: "100-Hour Inspection", dueCount: 6, status: "upcoming", priority: "high" },
  { item: "Annual Inspection", dueCount: 4, status: "current", priority: "medium" },
  { item: "Main Rotor Overhaul", dueCount: 2, status: "overdue", priority: "critical" },
  { item: "Tail Rotor Inspection", dueCount: 8, status: "upcoming", priority: "medium" },
  { item: "Engine Hot Section", dueCount: 3, status: "current", priority: "high" },
]

export default function HelicopterRepairPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rotorcraft Maintenance Center</h1>
          <p className="text-muted-foreground">Specialized helicopter maintenance and rotor system services</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets/new/helicopter-maintenance">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Helicopter Work Order
            </Button>
          </Link>
          <Link href="/compliance/rotorcraft-tracking">
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Rotorcraft Compliance
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Helicopters in Service</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">44</div>
            <p className="text-xs text-muted-foreground">+2 new registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$485,200</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Turnaround</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.8 days</div>
            <p className="text-xs text-muted-foreground">Complex rotor systems</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flight Hours/Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,200</div>
            <p className="text-xs text-muted-foreground">Fleet utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Rotorcraft Compliance Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Rotorcraft Compliance Dashboard
          </CardTitle>
          <CardDescription className="text-red-700">Critical maintenance items for helicopter fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {rotorcraftCompliance.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.item}</p>
                  <p className="text-xs text-muted-foreground">{item.dueCount} helicopters due</p>
                </div>
                <Badge
                  variant={
                    item.status === "overdue" ? "destructive" : item.status === "upcoming" ? "default" : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Helicopter Maintenance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Helicopter Maintenance Activity</CardTitle>
            <CardDescription>Monthly maintenance and overhaul volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={helicopterMaintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="scheduled" stroke="#3b82f6" name="Scheduled Maintenance" />
                <Line type="monotone" dataKey="unscheduled" stroke="#ef4444" name="Unscheduled Repairs" />
                <Line type="monotone" dataKey="inspections" stroke="#10b981" name="Inspections" />
                <Line type="monotone" dataKey="overhauls" stroke="#f59e0b" name="Overhauls" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Helicopter Fleet */}
        <Card>
          <CardHeader>
            <CardTitle>Helicopter Fleet</CardTitle>
            <CardDescription>Fleet composition and maintenance costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={helicopterTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Helicopter Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Helicopter Fleet Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Management</CardTitle>
          <CardDescription>Detailed helicopter information and maintenance costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {helicopterTypes.map((helicopter, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{helicopter.type}</p>
                    <Badge variant="outline">{helicopter.flightHours} hrs/year</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{helicopter.count} helicopters in fleet</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${helicopter.avgCost.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">avg annual maintenance</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/tickets/new/helicopter-maintenance?type=rotor">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <RotateCcw className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Rotor System</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/helicopter-maintenance?type=100hour">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">100-Hour Check</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/compliance/rotorcraft-ad">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium">AD Compliance</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory?category=helicopter-parts&filter=critical">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="font-medium">Rotor Parts</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

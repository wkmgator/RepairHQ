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
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const aircraftMaintenanceData = [
  { month: "Jan", scheduled: 12, unscheduled: 8, inspections: 15, modifications: 3 },
  { month: "Feb", scheduled: 14, unscheduled: 6, inspections: 18, modifications: 4 },
  { month: "Mar", scheduled: 16, unscheduled: 10, inspections: 20, modifications: 5 },
  { month: "Apr", scheduled: 18, unscheduled: 7, inspections: 22, modifications: 6 },
  { month: "May", scheduled: 15, unscheduled: 9, inspections: 19, modifications: 4 },
  { month: "Jun", scheduled: 20, unscheduled: 11, inspections: 25, modifications: 7 },
]

const aircraftTypes = [
  { type: "Cessna 172", count: 25, avgCost: 2500, certification: "Part 91" },
  { type: "Piper Cherokee", count: 18, avgCost: 2200, certification: "Part 91" },
  { type: "Beechcraft Bonanza", count: 12, avgCost: 3500, certification: "Part 91" },
  { type: "King Air 350", count: 8, avgCost: 8500, certification: "Part 135" },
  { type: "Citation CJ3", count: 5, avgCost: 15000, certification: "Part 135" },
]

const complianceItems = [
  { item: "Annual Inspection", dueCount: 8, status: "upcoming", priority: "high" },
  { item: "100-Hour Inspection", dueCount: 12, status: "current", priority: "medium" },
  { item: "Transponder Check", dueCount: 5, status: "overdue", priority: "critical" },
  { item: "ELT Battery", dueCount: 3, status: "upcoming", priority: "medium" },
  { item: "Pitot-Static Check", dueCount: 7, status: "current", priority: "high" },
]

export default function AirplaneRepairPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Aircraft Maintenance Center</h1>
          <p className="text-muted-foreground">FAA-certified aircraft maintenance and repair services</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets/new/aircraft-maintenance">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Work Order
            </Button>
          </Link>
          <Link href="/compliance/faa-tracking">
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              FAA Compliance
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aircraft in Service</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground">+3 new registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$284,500</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Turnaround</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 days</div>
            <p className="text-xs text-muted-foreground">-0.5 days from target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">FAA audit ready</p>
          </CardContent>
        </Card>
      </div>

      {/* FAA Compliance Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            FAA Compliance Dashboard
          </CardTitle>
          <CardDescription className="text-orange-700">
            Critical maintenance items requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {complianceItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.item}</p>
                  <p className="text-xs text-muted-foreground">{item.dueCount} aircraft due</p>
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
        {/* Maintenance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Activity</CardTitle>
            <CardDescription>Monthly maintenance and inspection volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aircraftMaintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="scheduled" stroke="#3b82f6" name="Scheduled Maintenance" />
                <Line type="monotone" dataKey="unscheduled" stroke="#ef4444" name="Unscheduled Repairs" />
                <Line type="monotone" dataKey="inspections" stroke="#10b981" name="Inspections" />
                <Line type="monotone" dataKey="modifications" stroke="#f59e0b" name="Modifications" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Aircraft Fleet */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Composition</CardTitle>
            <CardDescription>Aircraft types and maintenance costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aircraftTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Aircraft Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Aircraft Types Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Management</CardTitle>
          <CardDescription>Detailed aircraft information and maintenance costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aircraftTypes.map((aircraft, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{aircraft.type}</p>
                    <Badge variant="outline">{aircraft.certification}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{aircraft.count} aircraft in fleet</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${aircraft.avgCost.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">avg annual maintenance</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/tickets/new/aircraft-maintenance?type=annual">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Annual Inspection</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/aircraft-maintenance?type=100hour">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">100-Hour Check</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/compliance/ad-tracking">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium">AD Compliance</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory?category=aircraft-parts&filter=critical">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="font-medium">Parts Inventory</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

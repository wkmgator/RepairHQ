"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Anchor, Waves, Calendar, DollarSign, Clock, MapPin } from "lucide-react"
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

const marineServiceData = [
  { month: "Jan", engine: 25, electronics: 18, hull: 12, maintenance: 35 },
  { month: "Feb", engine: 28, electronics: 22, hull: 15, maintenance: 38 },
  { month: "Mar", engine: 32, electronics: 25, hull: 18, maintenance: 42 },
  { month: "Apr", engine: 45, electronics: 35, hull: 22, maintenance: 55 },
  { month: "May", engine: 52, electronics: 42, hull: 28, maintenance: 68 },
  { month: "Jun", engine: 48, electronics: 38, hull: 25, maintenance: 62 },
]

const dockOccupancy = [
  { dock: "A-Dock", capacity: 20, occupied: 18, utilization: 90 },
  { dock: "B-Dock", capacity: 15, occupied: 12, utilization: 80 },
  { dock: "C-Dock", capacity: 25, occupied: 22, utilization: 88 },
  { dock: "Service Bay", capacity: 8, occupied: 6, utilization: 75 },
]

const vesselTypes = [
  { name: "Sailboat", value: 35, color: "#3b82f6" },
  { name: "Motor Yacht", value: 30, color: "#10b981" },
  { name: "Fishing Boat", value: 20, color: "#f59e0b" },
  { name: "PWC/Jet Ski", value: 15, color: "#6b7280" },
]

export default function MarineRepairDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marine Repair Dashboard</h1>
          <p className="text-muted-foreground">Manage your marina and boat repair services</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Anchor className="mr-2 h-4 w-4" />
            New Service Ticket
          </Button>
          <Button variant="outline">
            <MapPin className="mr-2 h-4 w-4" />
            Dock Assignment
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Boats in Service</CardTitle>
            <Anchor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58</div>
            <p className="text-xs text-muted-foreground">6 in dry dock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marina Occupancy</CardTitle>
            <Waves className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">58/68 slips occupied</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2d</div>
            <p className="text-xs text-muted-foreground">-0.8d from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$78,450</div>
            <p className="text-xs text-muted-foreground">+32% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Marine Service Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Marine Service Trends</CardTitle>
            <CardDescription>Monthly service activity by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marineServiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="engine" stroke="#3b82f6" name="Engine Service" />
                <Line type="monotone" dataKey="electronics" stroke="#10b981" name="Electronics" />
                <Line type="monotone" dataKey="hull" stroke="#f59e0b" name="Hull Repair" />
                <Line type="monotone" dataKey="maintenance" stroke="#ef4444" name="Maintenance" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dock Occupancy */}
        <Card>
          <CardHeader>
            <CardTitle>Marina Dock Status</CardTitle>
            <CardDescription>Current dock utilization and capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dockOccupancy.map((dock, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{dock.dock}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={dock.utilization} className="w-32" />
                      <span className="text-xs text-muted-foreground">
                        {dock.occupied}/{dock.capacity}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={dock.utilization > 85 ? "destructive" : dock.utilization > 70 ? "default" : "secondary"}
                  >
                    {dock.utilization}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Vessel Types */}
        <Card>
          <CardHeader>
            <CardTitle>Vessel Types Serviced</CardTitle>
            <CardDescription>Breakdown by vessel type this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vesselTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {vesselTypes.map((entry, index) => (
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
            <CardDescription>Common tasks for marine service operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Anchor className="mr-2 h-4 w-4" />
                Engine Diagnostics
              </Button>
              <Button className="justify-start" variant="outline">
                <Waves className="mr-2 h-4 w-4" />
                Hull Inspection
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Seasonal Haul-Out
              </Button>
              <Button className="justify-start" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Assign Dock Space
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

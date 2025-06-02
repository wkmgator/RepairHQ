"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Truck, MapPin, Calendar, DollarSign, Clock, Route } from "lucide-react"
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

const rvServiceData = [
  { month: "Jan", ac: 25, slideout: 18, plumbing: 22, electrical: 15 },
  { month: "Feb", ac: 28, slideout: 22, plumbing: 25, electrical: 18 },
  { month: "Mar", ac: 35, slideout: 28, plumbing: 30, electrical: 22 },
  { month: "Apr", ac: 45, slideout: 35, plumbing: 38, electrical: 28 },
  { month: "May", ac: 62, slideout: 42, plumbing: 45, electrical: 35 },
  { month: "Jun", ac: 58, slideout: 38, plumbing: 42, electrical: 32 },
]

const mobileServiceRoutes = [
  { route: "Campground Circuit", rvs: 12, efficiency: 88, avgTime: "2.5h" },
  { route: "Highway Corridor", rvs: 8, efficiency: 92, avgTime: "3.2h" },
  { route: "State Park Loop", rvs: 15, efficiency: 85, avgTime: "2.8h" },
  { route: "RV Resort Zone", rvs: 10, efficiency: 95, avgTime: "2.1h" },
]

const rvTypes = [
  { name: "Class A Motorhome", value: 30, color: "#3b82f6" },
  { name: "Travel Trailer", value: 35, color: "#10b981" },
  { name: "Fifth Wheel", value: 20, color: "#f59e0b" },
  { name: "Class C/B", value: 15, color: "#6b7280" },
]

export default function RVRepairDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">RV & Camper Repair Dashboard</h1>
          <p className="text-muted-foreground">Manage mobile RV service and campground repairs</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Truck className="mr-2 h-4 w-4" />
            Mobile Service Call
          </Button>
          <Button variant="outline">
            <Route className="mr-2 h-4 w-4" />
            Plan Route
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RVs in Service</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">12 mobile calls today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Route Efficiency</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.6h</div>
            <p className="text-xs text-muted-foreground">-0.4h from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$38,750</div>
            <p className="text-xs text-muted-foreground">+25% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* RV Service Trends */}
        <Card>
          <CardHeader>
            <CardTitle>RV Service Trends</CardTitle>
            <CardDescription>Monthly service activity by system type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rvServiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ac" stroke="#3b82f6" name="AC/Heating" />
                <Line type="monotone" dataKey="slideout" stroke="#10b981" name="Slide-out" />
                <Line type="monotone" dataKey="plumbing" stroke="#f59e0b" name="Plumbing" />
                <Line type="monotone" dataKey="electrical" stroke="#ef4444" name="Electrical" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mobile Service Routes */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile Service Routes</CardTitle>
            <CardDescription>Today's mobile service performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mobileServiceRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{route.route}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={route.efficiency} className="w-32" />
                      <span className="text-xs text-muted-foreground">{route.efficiency}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {route.rvs} RVs • {route.avgTime} avg
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
        {/* RV Types */}
        <Card>
          <CardHeader>
            <CardTitle>RV Types Serviced</CardTitle>
            <CardDescription>Breakdown by RV type this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rvTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {rvTypes.map((entry, index) => (
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
            <CardDescription>Common tasks for RV service operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button className="justify-start" variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Emergency Roadside Service
              </Button>
              <Button className="justify-start" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Campground Service Call
              </Button>
              <Button className="justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Seasonal Prep Service
              </Button>
              <Button className="justify-start" variant="outline">
                <Route className="mr-2 h-4 w-4" />
                Optimize Service Routes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

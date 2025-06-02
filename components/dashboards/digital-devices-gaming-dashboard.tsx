"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Smartphone, Computer, Gamepad2, AlertTriangle, Clock, DollarSign, Wrench, Users } from "lucide-react"
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
  Legend,
} from "recharts"

const monthlyRepairData = [
  { month: "Jan", phones: 45, pcs: 30, consoles: 15, revenue: 7500 },
  { month: "Feb", phones: 52, pcs: 35, consoles: 18, revenue: 8200 },
  { month: "Mar", phones: 48, pcs: 32, consoles: 20, revenue: 7900 },
  { month: "Apr", phones: 61, pcs: 40, consoles: 22, revenue: 9500 },
  { month: "May", phones: 55, pcs: 38, consoles: 25, revenue: 8800 },
  { month: "Jun", phones: 67, pcs: 45, consoles: 28, revenue: 10500 },
]

const deviceTypeBreakdown = [
  { name: "Smartphones", value: 40, color: "#3b82f6" },
  { name: "Laptops/Desktops", value: 35, color: "#10b981" },
  { name: "Gaming Consoles", value: 15, color: "#f59e0b" },
  { name: "Tablets & Other", value: 10, color: "#6b7280" },
]

const commonIssues = [
  { issue: "Cracked Screen (Phone)", count: 120, avgTime: "1.5h" },
  { issue: "Battery Replacement (Phone/Laptop)", count: 95, avgTime: "1h" },
  { issue: "Software Malware (PC)", count: 70, avgTime: "2.5h" },
  { issue: "Console Overheating (PS/Xbox)", count: 45, avgTime: "3h" },
  { issue: "Keyboard/Trackpad (Laptop)", count: 30, avgTime: "1.2h" },
]

const lowStockParts = [
  { part: "iPhone 15 Screen", current: 5, minimum: 15, urgency: "high" },
  { part: "Laptop SSD 1TB", current: 8, minimum: 20, urgency: "medium" },
  { part: "PS5 HDMI Port", current: 3, minimum: 10, urgency: "high" },
  { part: "Gaming PC RAM 16GB DDR5", current: 12, minimum: 25, urgency: "low" },
]

export default function DigitalDevicesGamingDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Digital Devices & Gaming Dashboard</h1>
          <p className="text-muted-foreground">Manage repairs for phones, PCs, consoles, and more.</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Smartphone className="mr-2 h-4 w-4" /> New Phone Repair
          </Button>
          <Button>
            <Computer className="mr-2 h-4 w-4" /> New PC Repair
          </Button>
          <Button>
            <Gamepad2 className="mr-2 h-4 w-4" /> New Console Repair
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,350</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1h</div>
            <p className="text-xs text-muted-foreground">-0.3h from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technicians Online</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 Phone, 3 PC, 2 Console</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Repair Trends by Device Type */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Repair Volume & Revenue</CardTitle>
            <CardDescription>Volume of repairs by device type and total revenue.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRepairData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="phones" stroke="#3b82f6" name="Phone Repairs" />
                <Line yAxisId="left" type="monotone" dataKey="pcs" stroke="#10b981" name="PC Repairs" />
                <Line yAxisId="left" type="monotone" dataKey="consoles" stroke="#f59e0b" name="Console Repairs" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Repair Distribution by Device Type</CardTitle>
            <CardDescription>Current month's repair distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceTypeBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceTypeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Common Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Most Common Issues</CardTitle>
            <CardDescription>Top reported issues across all device types.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commonIssues.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.issue}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{item.count} cases</Badge>
                    <span className="text-xs text-muted-foreground">Avg: {item.avgTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Parts
            </CardTitle>
            <CardDescription>Critical parts running low on inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockParts.map((part, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{part.part}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={(part.current / (part.minimum * 2)) * 100} className="w-24 h-2" />{" "}
                      {/* Adjusted for better visual */}
                      <span className="text-xs text-muted-foreground">
                        {part.current}/{part.minimum}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant={part.urgency === "high" ? "destructive" : "outline"}>
                    Order
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

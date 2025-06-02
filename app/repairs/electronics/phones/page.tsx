"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Smartphone, Battery, Shield, Wrench, TrendingUp, AlertTriangle, Clock, DollarSign, Plus } from "lucide-react"
import Link from "next/link"
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

const phoneRepairData = [
  { month: "Jan", screenRepairs: 45, batteryRepairs: 23, waterDamage: 12 },
  { month: "Feb", screenRepairs: 52, batteryRepairs: 28, waterDamage: 15 },
  { month: "Mar", screenRepairs: 48, batteryRepairs: 31, waterDamage: 18 },
  { month: "Apr", screenRepairs: 61, batteryRepairs: 35, waterDamage: 14 },
  { month: "May", screenRepairs: 55, batteryRepairs: 29, waterDamage: 16 },
  { month: "Jun", screenRepairs: 67, batteryRepairs: 42, waterDamage: 19 },
]

const deviceBreakdown = [
  { name: "iPhone", value: 45, color: "#3b82f6" },
  { name: "Samsung", value: 30, color: "#10b981" },
  { name: "Google Pixel", value: 15, color: "#f59e0b" },
  { name: "Other", value: 10, color: "#6b7280" },
]

const commonIssues = [
  { issue: "Cracked Screen", frequency: 85, avgCost: 150 },
  { issue: "Battery Replacement", frequency: 72, avgCost: 80 },
  { issue: "Water Damage", frequency: 45, avgCost: 200 },
  { issue: "Charging Port", frequency: 38, avgCost: 90 },
  { issue: "Camera Issues", frequency: 25, avgCost: 120 },
]

export default function PhoneRepairPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phone Repair Center</h1>
          <p className="text-muted-foreground">Manage smartphone and mobile device repairs</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets/new/phone-repair">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Phone Repair
            </Button>
          </Link>
          <Link href="/inventory?category=phone-parts">
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Phone Parts Inventory
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Phone Repairs</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,247</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-muted-foreground">-0.2h from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-muted-foreground">+0.1 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Repair Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Repair Trends</CardTitle>
            <CardDescription>Monthly repair volume by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={phoneRepairData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="screenRepairs" stroke="#3b82f6" name="Screen Repairs" />
                <Line type="monotone" dataKey="batteryRepairs" stroke="#10b981" name="Battery Repairs" />
                <Line type="monotone" dataKey="waterDamage" stroke="#f59e0b" name="Water Damage" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Repairs by device brand this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Common Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Common Phone Issues</CardTitle>
          <CardDescription>Most frequent repair types and average costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commonIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{issue.issue}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={issue.frequency} className="w-32" />
                    <span className="text-xs text-muted-foreground">{issue.frequency}% frequency</span>
                  </div>
                </div>
                <Badge variant="outline">${issue.avgCost} avg</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/tickets/new/phone-repair?type=screen">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Screen Repair</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/phone-repair?type=battery">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Battery className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Battery Replacement</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/phone-repair?type=water">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium">Water Damage</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory?category=phone-parts&filter=low-stock">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="font-medium">Check Inventory</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

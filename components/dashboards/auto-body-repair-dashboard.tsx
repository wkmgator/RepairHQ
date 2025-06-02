"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Car, Wrench, DollarSign, Clock, Palette, FileText } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Link from "next/link"

// Mock data - replace with actual data fetching
const monthlyRevenueData = [
  { month: "Jan", revenue: 15000, estimates: 25 },
  { month: "Feb", revenue: 18000, estimates: 30 },
  { month: "Mar", revenue: 22000, estimates: 35 },
  { month: "Apr", revenue: 20000, estimates: 32 },
  { month: "May", revenue: 25000, estimates: 40 },
  { month: "Jun", revenue: 28000, estimates: 45 },
]

const repairStatusData = [
  { name: "Estimate", value: 12, color: "#3b82f6" },
  { name: "Awaiting Parts", value: 8, color: "#f59e0b" },
  { name: "In Body Shop", value: 15, color: "#ef4444" },
  { name: "In Paint Booth", value: 6, color: "#8b5cf6" },
  { name: "Assembly", value: 4, color: "#10b981" },
  { name: "Ready for Pickup", value: 7, color: "#14b8a6" },
]

const insuranceVsCustomerPay = [
  { name: "Insurance Pay", value: 70, color: "#3b82f6" },
  { name: "Customer Pay", value: 30, color: "#10b981" },
]

export default function AutoBodyRepairDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Auto Body Repair Dashboard</h1>
          <p className="text-muted-foreground">Overview of your collision center operations</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/tickets/new/auto-body">
              <Car className="mr-2 h-4 w-4" /> New Repair Order
            </Link>
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Create Estimate
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">33</div>
            <p className="text-xs text-muted-foreground">Across all stages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,350</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Cycle Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2 Days</div>
            <p className="text-xs text-muted-foreground">-0.8 days from last qtr</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paint Booth Usage</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-1" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue & Estimates</CardTitle>
            <CardDescription>Track financial performance and estimate volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue ($)" />
                <Line yAxisId="right" type="monotone" dataKey="estimates" stroke="#10b981" name="Estimates" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Repair Status</CardTitle>
            <CardDescription>Distribution of jobs across repair stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={repairStatusData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" name="Jobs" fill="#8884d8">
                  {repairStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Insurance vs. Customer Pay</CardTitle>
            <CardDescription>Breakdown of job payment types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={insuranceVsCustomerPay}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {insuranceVsCustomerPay.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access common tasks quickly</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link href="/inventory?category=auto-body">Parts Inventory</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/customers">Customer Management</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/reports/auto-body">View Reports</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/settings/team">Technician Schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

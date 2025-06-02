"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gamepad2, Cpu, HardDrive, Wrench, TrendingUp, AlertTriangle, Clock, DollarSign, Plus } from "lucide-react"
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

const consoleRepairData = [
  { month: "Jan", ps5: 15, xbox: 12, nintendo: 8, retro: 5 },
  { month: "Feb", ps5: 18, xbox: 14, nintendo: 10, retro: 6 },
  { month: "Mar", ps5: 22, xbox: 16, nintendo: 12, retro: 8 },
  { month: "Apr", ps5: 25, xbox: 18, nintendo: 14, retro: 7 },
  { month: "May", ps5: 20, xbox: 15, nintendo: 11, retro: 9 },
  { month: "Jun", ps5: 28, xbox: 20, nintendo: 16, retro: 10 },
]

const consoleBreakdown = [
  { name: "PlayStation 5", value: 35, color: "#0070f3" },
  { name: "Xbox Series X/S", value: 28, color: "#107c10" },
  { name: "Nintendo Switch", value: 25, color: "#e60012" },
  { name: "Retro Consoles", value: 12, color: "#6b7280" },
]

const commonIssues = [
  { issue: "HDMI Port Repair", frequency: 75, avgCost: 120, difficulty: "Medium" },
  { issue: "Overheating/Fan Issues", frequency: 68, avgCost: 90, difficulty: "Easy" },
  { issue: "Disc Drive Problems", frequency: 55, avgCost: 150, difficulty: "Hard" },
  { issue: "Controller Drift", frequency: 82, avgCost: 60, difficulty: "Easy" },
  { issue: "Power Supply Issues", frequency: 45, avgCost: 180, difficulty: "Hard" },
]

export default function ConsolesRepairPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gaming Console Repair</h1>
          <p className="text-muted-foreground">PlayStation, Xbox, Nintendo, and retro console repairs</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets/new/console-repair">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Console Repair
            </Button>
          </Link>
          <Link href="/inventory?category=console-parts">
            <Button variant="outline">
              <Gamepad2 className="mr-2 h-4 w-4" />
              Console Parts
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Console Repairs</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,890</div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5h</div>
            <p className="text-xs text-muted-foreground">-0.3h from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">+1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Console Repair Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Console Repair Trends</CardTitle>
            <CardDescription>Monthly repair volume by console type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consoleRepairData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ps5" stroke="#0070f3" name="PlayStation 5" />
                <Line type="monotone" dataKey="xbox" stroke="#107c10" name="Xbox Series" />
                <Line type="monotone" dataKey="nintendo" stroke="#e60012" name="Nintendo Switch" />
                <Line type="monotone" dataKey="retro" stroke="#6b7280" name="Retro Consoles" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Console Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Console Distribution</CardTitle>
            <CardDescription>Repairs by console type this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={consoleBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {consoleBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Common Console Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Common Console Issues</CardTitle>
          <CardDescription>Most frequent problems and repair difficulty</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commonIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{issue.issue}</p>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          issue.difficulty === "Easy"
                            ? "default"
                            : issue.difficulty === "Medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {issue.difficulty}
                      </Badge>
                      <Badge variant="outline">${issue.avgCost}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={issue.frequency} className="w-32" />
                    <span className="text-xs text-muted-foreground">{issue.frequency}% frequency</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/tickets/new/console-repair?type=hdmi">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Cpu className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">HDMI Repair</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/console-repair?type=overheating">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium">Overheating Fix</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/console-repair?type=disc-drive">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <HardDrive className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Disc Drive</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory?category=console-parts&filter=low-stock">
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

"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Monitor, Zap, Settings, Wrench, TrendingUp, Clock, DollarSign, Plus } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const tvRepairData = [
  { month: "Jan", screenIssues: 25, powerProblems: 18, audioIssues: 12 },
  { month: "Feb", screenIssues: 28, powerProblems: 22, audioIssues: 15 },
  { month: "Mar", screenIssues: 32, powerProblems: 19, audioIssues: 14 },
  { month: "Apr", screenIssues: 35, powerProblems: 25, audioIssues: 18 },
  { month: "May", screenIssues: 30, powerProblems: 23, audioIssues: 16 },
  { month: "Jun", screenIssues: 38, powerProblems: 28, audioIssues: 20 },
]

const tvBrands = [
  { brand: "Samsung", repairs: 45, avgCost: 280 },
  { brand: "LG", repairs: 38, avgCost: 250 },
  { brand: "Sony", repairs: 32, avgCost: 320 },
  { brand: "TCL", repairs: 28, avgCost: 180 },
  { brand: "Vizio", repairs: 25, avgCost: 200 },
]

export default function TVRepairPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">TV Repair Center</h1>
          <p className="text-muted-foreground">Television and display repair services</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets/new/tv-repair">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New TV Repair
            </Button>
          </Link>
          <Link href="/inventory?category=tv-parts">
            <Button variant="outline">
              <Monitor className="mr-2 h-4 w-4" />
              TV Parts Inventory
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active TV Repairs</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,180</div>
            <p className="text-xs text-muted-foreground">+22% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">-0.5h from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* TV Repair Trends */}
        <Card>
          <CardHeader>
            <CardTitle>TV Repair Trends</CardTitle>
            <CardDescription>Monthly repair volume by issue type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tvRepairData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="screenIssues" stroke="#3b82f6" name="Screen Issues" />
                <Line type="monotone" dataKey="powerProblems" stroke="#ef4444" name="Power Problems" />
                <Line type="monotone" dataKey="audioIssues" stroke="#10b981" name="Audio Issues" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Brand Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Repairs by Brand</CardTitle>
            <CardDescription>Volume and average cost by TV brand</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tvBrands}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="repairs" fill="#3b82f6" name="Repair Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Common TV Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Common TV Issues</CardTitle>
          <CardDescription>Most frequent problems and repair complexity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Screen/Display Issues</span>
                <Badge variant="destructive">High Priority</Badge>
              </div>
              <Progress value={85} className="w-full" />
              <p className="text-xs text-muted-foreground">85% of repairs, avg $280</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Power Supply Problems</span>
                <Badge variant="default">Medium Priority</Badge>
              </div>
              <Progress value={65} className="w-full" />
              <p className="text-xs text-muted-foreground">65% of repairs, avg $150</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Audio/Sound Issues</span>
                <Badge variant="secondary">Low Priority</Badge>
              </div>
              <Progress value={45} className="w-full" />
              <p className="text-xs text-muted-foreground">45% of repairs, avg $120</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Smart TV/Software</span>
                <Badge variant="outline">Quick Fix</Badge>
              </div>
              <Progress value={30} className="w-full" />
              <p className="text-xs text-muted-foreground">30% of repairs, avg $80</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/tickets/new/tv-repair?type=screen">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Screen Repair</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/tv-repair?type=power">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="font-medium">Power Issues</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/tv-repair?type=audio">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Settings className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Audio Problems</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory?category=tv-parts&filter=low-stock">
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

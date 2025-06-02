"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Watch, Battery, Droplets, Wrench, TrendingUp, Clock, DollarSign, Plus, Gem } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const watchRepairData = [
  { month: "Jan", battery: 25, waterDamage: 8, mechanical: 12, screen: 6 },
  { month: "Feb", battery: 28, waterDamage: 10, mechanical: 14, screen: 8 },
  { month: "Mar", battery: 32, waterDamage: 12, mechanical: 16, screen: 10 },
  { month: "Apr", battery: 35, waterDamage: 9, mechanical: 18, screen: 12 },
  { month: "May", battery: 30, waterDamage: 11, mechanical: 15, screen: 9 },
  { month: "Jun", battery: 38, waterDamage: 13, mechanical: 20, screen: 14 },
]

const watchBrands = [
  { brand: "Apple Watch", repairs: 45, avgCost: 180, specialty: "Smart" },
  { brand: "Rolex", repairs: 12, avgCost: 850, specialty: "Luxury" },
  { brand: "Omega", repairs: 8, avgCost: 650, specialty: "Luxury" },
  { brand: "Seiko", repairs: 22, avgCost: 120, specialty: "Mechanical" },
  { brand: "Casio", repairs: 18, avgCost: 80, specialty: "Digital" },
]

export default function WatchRepairPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Watch Repair Center</h1>
          <p className="text-muted-foreground">Smartwatch, luxury, and mechanical timepiece repairs</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets/new/watch-repair">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Watch Repair
            </Button>
          </Link>
          <Link href="/inventory?category=watch-parts">
            <Button variant="outline">
              <Watch className="mr-2 h-4 w-4" />
              Watch Parts
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Watch Repairs</CardTitle>
            <Watch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,450</div>
            <p className="text-xs text-muted-foreground">+25% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8h</div>
            <p className="text-xs text-muted-foreground">-0.4h from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precision Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">+1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Watch Repair Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Watch Repair Trends</CardTitle>
            <CardDescription>Monthly repair volume by issue type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={watchRepairData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="battery" stroke="#3b82f6" name="Battery Issues" />
                <Line type="monotone" dataKey="waterDamage" stroke="#ef4444" name="Water Damage" />
                <Line type="monotone" dataKey="mechanical" stroke="#10b981" name="Mechanical" />
                <Line type="monotone" dataKey="screen" stroke="#f59e0b" name="Screen/Display" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Brand Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Repairs by Brand</CardTitle>
            <CardDescription>Volume and average cost by watch brand</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={watchBrands}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="repairs" fill="#3b82f6" name="Repair Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Watch Specialties */}
      <Card>
        <CardHeader>
          <CardTitle>Watch Repair Specialties</CardTitle>
          <CardDescription>Different watch types require specialized expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Watch className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Smart Watches</span>
                <Badge variant="default">High Volume</Badge>
              </div>
              <Progress value={75} className="w-full" />
              <p className="text-xs text-muted-foreground">Battery, screen, water damage repairs</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Luxury Watches</span>
                <Badge variant="secondary">High Value</Badge>
              </div>
              <Progress value={45} className="w-full" />
              <p className="text-xs text-muted-foreground">Mechanical movements, crystal replacement</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-green-500" />
                <span className="font-medium">Mechanical</span>
                <Badge variant="outline">Specialized</Badge>
              </div>
              <Progress value={60} className="w-full" />
              <p className="text-xs text-muted-foreground">Movement service, spring replacement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/tickets/new/watch-repair?type=battery">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Battery className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Battery Replacement</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/watch-repair?type=water">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Droplets className="h-8 w-8 mx-auto mb-2 text-cyan-500" />
              <p className="font-medium">Water Damage</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/watch-repair?type=mechanical">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Mechanical Service</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory?category=watch-parts&filter=luxury">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Gem className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="font-medium">Luxury Parts</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

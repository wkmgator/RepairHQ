"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Smartphone,
  Monitor,
  Gamepad2,
  Watch,
  Cpu,
  Home,
  Car,
  Plane,
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

const verticalCategories = [
  {
    title: "Electronics Repair",
    description: "Consumer electronics and mobile devices",
    icon: Smartphone,
    color: "text-blue-500",
    items: [
      { name: "Phone Repair", href: "/repairs/electronics/phones", icon: Smartphone },
      { name: "TV Repair", href: "/repairs/electronics/tvs", icon: Monitor },
      { name: "Gaming Consoles", href: "/repairs/electronics/consoles", icon: Gamepad2 },
      { name: "Watch Repair", href: "/repairs/electronics/watches", icon: Watch },
    ],
  },
  {
    title: "Specialized Services",
    description: "Advanced technical repair services",
    icon: Cpu,
    color: "text-purple-500",
    items: [
      { name: "Micro Soldering", href: "/repairs/microsoldering", icon: Cpu },
      { name: "Appliance Repair", href: "/repairs/appliances", icon: Home },
      { name: "Auto Repair", href: "/repairs/auto-repair", icon: Car },
    ],
  },
  {
    title: "Aerospace Services",
    description: "Aircraft and helicopter maintenance",
    icon: Plane,
    color: "text-orange-500",
    items: [
      { name: "Aircraft Maintenance", href: "/repairs/aerospace/airplanes", icon: Plane },
      { name: "Helicopter Service", href: "/repairs/aerospace/helicopters", icon: Plane },
    ],
  },
]

export default function DefaultRepairLandingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">RepairHQ Service Center</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose your repair specialty to access industry-specific tools, templates, and workflows
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Repairs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">Across all verticals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">Multi-vertical customer base</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89,240</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Vertical Categories */}
      <div className="space-y-8">
        {verticalCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <category.icon className={`h-6 w-6 ${category.color}`} />
                {category.title}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {category.items.map((item, itemIndex) => (
                  <Link key={itemIndex} href={item.href}>
                    <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <item.icon className={`h-12 w-12 mx-auto mb-3 ${category.color}`} />
                        <h3 className="font-semibold mb-2">{item.name}</h3>
                        <div className="flex items-center justify-center text-sm text-muted-foreground">
                          <span>Enter Service Center</span>
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks across all repair verticals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/tickets/new">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Create New Ticket
              </Button>
            </Link>
            <Link href="/customers/new">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
            </Link>
            <Link href="/inventory">
              <Button className="w-full justify-start" variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Check Inventory
              </Button>
            </Link>
            <Link href="/reports">
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

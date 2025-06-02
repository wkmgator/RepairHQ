"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RepairIndustry, getIndustryConfig } from "@/lib/industry-config"
import {
  Smartphone,
  Laptop,
  Gem,
  Watch,
  Plane,
  Mail,
  PenToolIcon as Tool,
  Bike,
  Wifi,
  Camera,
  Car,
  Circle,
  Droplet,
  BarChart2,
  ClipboardList,
  Users,
  Package,
  Calendar,
  DollarSign,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

interface IndustryDashboardProps {
  industry?: RepairIndustry
}

export function IndustryDashboard({ industry = RepairIndustry.CELL_PHONE }: IndustryDashboardProps) {
  const [industryConfig, setIndustryConfig] = useState(getIndustryConfig(industry))

  useEffect(() => {
    // Update industry config when industry changes
    setIndustryConfig(getIndustryConfig(industry))
  }, [industry])

  const getIndustryIcon = (size = 5) => {
    const className = `h-${size} w-${size}`

    switch (industry) {
      case RepairIndustry.CELL_PHONE:
        return <Smartphone className={className} />
      case RepairIndustry.COMPUTER:
        return <Laptop className={className} />
      case RepairIndustry.JEWELRY:
        return <Gem className={className} />
      case RepairIndustry.WATCH:
        return <Watch className={className} />
      case RepairIndustry.DRONE:
        return <Plane className={className} />
      case RepairIndustry.MAIL_IN:
        return <Mail className={className} />
      case RepairIndustry.POWER_TOOLS:
        return <Tool className={className} />
      case RepairIndustry.BICYCLE:
        return <Bike className={className} />
      case RepairIndustry.WIRELESS:
        return <Wifi className={className} />
      case RepairIndustry.CAMERA:
        return <Camera className={className} />
      case RepairIndustry.AUTO_REPAIR:
        return <Car className={className} />
      case RepairIndustry.MOTORCYCLE_REPAIR:
        return <Bike className={className} />
      case RepairIndustry.TIRE_SERVICE:
        return <Circle className={className} />
      case RepairIndustry.OIL_CHANGE:
        return <Droplet className={className} />
      default:
        return <Smartphone className={className} />
    }
  }

  // Mock data for dashboard
  const dashboardData = {
    activeTickets: 12,
    completedToday: 5,
    pendingPickup: 3,
    totalCustomers: 248,
    revenueToday: 1245.5,
    averageTicket: 185.75,
    inventoryItems: 156,
    lowStockItems: 8,
    upcomingAppointments: 7,
    recentTickets: [
      { id: "TK-12345", customer: "John Doe", device: "iPhone 13", status: "In Progress", created: "2 hours ago" },
      {
        id: "TK-12344",
        customer: "Jane Smith",
        device: "MacBook Pro",
        status: "Waiting for Parts",
        created: "5 hours ago",
      },
      {
        id: "TK-12343",
        customer: "Bob Johnson",
        device: "Samsung Galaxy S22",
        status: "Completed",
        created: "1 day ago",
      },
    ],
    popularServices: [
      { name: "Screen Replacement", count: 45 },
      { name: "Battery Replacement", count: 32 },
      { name: "Water Damage Repair", count: 18 },
      { name: "Charging Port Repair", count: 15 },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-full bg-${industryConfig.color}-100 text-${industryConfig.color}-500`}>
            {getIndustryIcon()}
          </div>
          <h2 className="text-2xl font-bold">{industryConfig.name} Dashboard</h2>
        </div>
        <Button asChild>
          <Link href="/tickets/new">Create New Ticket</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tickets</p>
                <p className="text-3xl font-bold">{dashboardData.activeTickets}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-3xl font-bold">{dashboardData.completedToday}</p>
              </div>
              <div className="p-2 rounded-full bg-green-100 text-green-500">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Today</p>
                <p className="text-3xl font-bold">${dashboardData.revenueToday.toFixed(2)}</p>
              </div>
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-500">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Appointments</p>
                <p className="text-3xl font-bold">{dashboardData.upcomingAppointments}</p>
              </div>
              <div className="p-2 rounded-full bg-purple-100 text-purple-500">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Latest repair tickets in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-3 font-medium text-sm bg-muted/50">
                <div>Ticket #</div>
                <div>Customer</div>
                <div>Device</div>
                <div>Status</div>
                <div>Created</div>
              </div>
              {dashboardData.recentTickets.map((ticket) => (
                <div key={ticket.id} className="grid grid-cols-5 p-3 text-sm border-t">
                  <div className="font-medium">{ticket.id}</div>
                  <div>{ticket.customer}</div>
                  <div>{ticket.device}</div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        ticket.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : ticket.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <div className="text-muted-foreground">{ticket.created}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link href="/tickets">View All Tickets</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>Most requested repair services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.popularServices.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-1.5 rounded-full bg-${industryConfig.color}-100 text-${industryConfig.color}-500`}
                    >
                      {getIndustryIcon(4)}
                    </div>
                    <span>{service.name}</span>
                  </div>
                  <span className="font-medium">{service.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/analytics">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Current inventory levels and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">{dashboardData.inventoryItems}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-orange-500" />
                  <span className="text-2xl font-bold">{dashboardData.lowStockItems}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/inventory">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Inventory
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Metrics</CardTitle>
            <CardDescription>Customer statistics and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-500" />
                  <span className="text-2xl font-bold">{dashboardData.totalCustomers}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg. Ticket Value</p>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">${dashboardData.averageTicket.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/customers">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Customers
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

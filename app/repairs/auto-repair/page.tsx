"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Wrench, Calendar, DollarSign, TrendingUp, Clock, Users, Plus } from "lucide-react"
import Link from "next/link"

export default function AutoRepairPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automotive Repair Center</h1>
          <p className="text-muted-foreground">Full-service automotive repair and maintenance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets/new/auto-repair">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Service Order
            </Button>
          </Link>
          <Link href="/appointments?filter=auto">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles in Service</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">6 bays occupied</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,280</div>
            <p className="text-xs text-muted-foreground">+20% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2h</div>
            <p className="text-xs text-muted-foreground">Per vehicle</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <Wrench className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="font-semibold mb-2">General Maintenance</h3>
            <p className="text-sm text-muted-foreground mb-4">Oil changes, tune-ups, inspections</p>
            <Badge variant="default">High Volume</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Car className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="font-semibold mb-2">Engine & Transmission</h3>
            <p className="text-sm text-muted-foreground mb-4">Major repairs and rebuilds</p>
            <Badge variant="destructive">Complex</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold mb-2">Diagnostics</h3>
            <p className="text-sm text-muted-foreground mb-4">Computer diagnostics and troubleshooting</p>
            <Badge variant="secondary">Technical</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

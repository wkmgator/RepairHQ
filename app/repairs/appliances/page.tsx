"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, MapPin, DollarSign, Clock, Route, Plus } from "lucide-react"
import Link from "next/link"

export default function AppliancesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appliance Repair Services</h1>
          <p className="text-muted-foreground">In-home appliance repair and maintenance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets/new/appliance-repair">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Service Call
            </Button>
          </Link>
          <Link href="/routes/optimize">
            <Button variant="outline">
              <Route className="mr-2 h-4 w-4" />
              Optimize Routes
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Service Calls</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">4 zones covered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Route Efficiency</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Optimized routing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8h</div>
            <p className="text-xs text-muted-foreground">Per service call</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,340</div>
            <p className="text-xs text-muted-foreground">+15% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Areas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <Home className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="font-semibold mb-2">Kitchen Appliances</h3>
            <p className="text-sm text-muted-foreground mb-4">Refrigerators, dishwashers, ovens, microwaves</p>
            <Badge variant="default">High Demand</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Home className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold mb-2">Laundry Equipment</h3>
            <p className="text-sm text-muted-foreground mb-4">Washers, dryers, combo units</p>
            <Badge variant="secondary">Frequent</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Home className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="font-semibold mb-2">HVAC Systems</h3>
            <p className="text-sm text-muted-foreground mb-4">Air conditioning, heating units</p>
            <Badge variant="outline">Seasonal</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

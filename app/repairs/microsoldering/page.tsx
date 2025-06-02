"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Cpu, Zap, Microscope, Wrench, TrendingUp, Clock, DollarSign, Plus, CircuitBoard } from "lucide-react"
import Link from "next/link"

export default function MicrosoldingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Micro Soldering Lab</h1>
          <p className="text-muted-foreground">Board-level repair and component-level diagnostics</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tickets/new/microsoldering">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Board Repair
            </Button>
          </Link>
          <Link href="/inventory?category=microsoldering-tools">
            <Button variant="outline">
              <Microscope className="mr-2 h-4 w-4" />
              Lab Equipment
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Board Repairs</CardTitle>
            <CircuitBoard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Complex diagnostics</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Board-level repairs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Repair Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5h</div>
            <p className="text-xs text-muted-foreground">Precision work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,240</div>
            <p className="text-xs text-muted-foreground">High-value repairs</p>
          </CardContent>
        </Card>
      </div>

      {/* Specialization Areas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <Cpu className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="font-semibold mb-2">CPU/GPU Repair</h3>
            <p className="text-sm text-muted-foreground mb-4">Reballing, underfill, and thermal management</p>
            <Badge variant="default">Advanced</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="font-semibold mb-2">Power Management</h3>
            <p className="text-sm text-muted-foreground mb-4">PMIC, charging circuits, power rails</p>
            <Badge variant="secondary">Specialized</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CircuitBoard className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-semibold mb-2">Component Recovery</h3>
            <p className="text-sm text-muted-foreground mb-4">Donor board harvesting and testing</p>
            <Badge variant="outline">Precision</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/tickets/new/microsoldering?type=cpu">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Cpu className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">CPU/GPU Repair</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/microsoldering?type=power">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="font-medium">Power Issues</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/tickets/new/microsoldering?type=diagnostic">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Microscope className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium">Board Diagnostic</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory?category=microsoldering-components">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="font-medium">Components</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

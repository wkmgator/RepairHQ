"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Factory, Wrench, ListChecks, PlusCircle, BarChart3 } from "lucide-react"

export default function IndustrialRepairPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg shadow-xl">
        <Factory className="mx-auto h-16 w-16 mb-4 text-blue-400" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Industrial Maintenance & Repair HQ</h1>
        <p className="mt-4 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
          Streamline your plant operations, maximize uptime, and ensure compliance with RepairHQ's specialized
          industrial module.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/tickets/new/industrial-repair">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Work Order
            </Button>
          </Link>
          <Link href="/dashboard?vertical=industrial-repair">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-6 w-6 text-blue-600" />
              Equipment Management
            </CardTitle>
            <CardDescription>Track assets, schedule preventive maintenance, and manage repair history.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Asset tagging and tracking</li>
              <li>Detailed equipment specifications</li>
              <li>Maintenance logs and history</li>
            </ul>
            <Link href="/inventory?category=industrial_equipment" className="mt-4 block">
              <Button variant="outline" className="w-full">
                View Equipment
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks className="mr-2 h-6 w-6 text-green-600" />
              Work Order & PM Scheduling
            </CardTitle>
            <CardDescription>Efficiently manage corrective and preventive maintenance tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Customizable work order forms</li>
              <li>Automated PM scheduling</li>
              <li>Technician assignment and tracking</li>
            </ul>
            <Link href="/tickets?status=open&category=industrial" className="mt-4 block">
              <Button variant="outline" className="w-full">
                Manage Work Orders
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-6 w-6 text-purple-600" />
              Reporting & Analytics
            </CardTitle>
            <CardDescription>Gain insights into equipment performance, costs, and team efficiency.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Downtime analysis</li>
              <li>Maintenance cost tracking</li>
              <li>Compliance reporting</li>
            </ul>
            <Link href="/analytics?report_type=industrial_overview" className="mt-4 block">
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Add more sections like: Parts Inventory, Compliance Management, Technician Mobile App */}
    </div>
  )
}

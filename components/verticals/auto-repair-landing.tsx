"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Wrench, FileText, DollarSign, BarChart3 } from "lucide-react"

export default function AutoRepairLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-red-100 text-red-800">Automotive Repair Software</Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Complete Auto Shop Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage work orders, track inventory, handle invoicing, and grow your auto repair business with our
            comprehensive platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Car className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Vehicle Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Complete vehicle history, VIN decoding, and maintenance tracking for all makes and models.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Digital work orders with photo documentation, time tracking, and automated customer updates.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Invoicing & Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Professional invoices, payment processing, and integration with QuickBooks and other accounting
                software.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="mb-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <CardContent className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">2,500+</div>
                <div className="text-red-100">Auto Shops</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">45%</div>
                <div className="text-red-100">Revenue Increase</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">60%</div>
                <div className="text-red-100">Time Saved</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-red-100">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Industry-Specific Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-6 h-6 text-red-600" />
                Auto-Specific Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  VIN decoding and vehicle lookup
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Parts catalog integration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Labor time guides
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Inspection checklists
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Warranty tracking
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-red-600" />
                Business Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Revenue and profit analytics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Technician performance tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Customer retention metrics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Inventory turnover reports
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  Marketing ROI tracking
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA */}
        <Card className="text-center">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Modernize Your Auto Shop?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join the thousands of auto repair shops that have transformed their business with RepairHQ.
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Get Started Today
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

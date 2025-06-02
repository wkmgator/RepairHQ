"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package, FileText, DollarSign, Clock, Plus, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { userProfile } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration issues
  if (!mounted) {
    return null
  }

  // Show a message if user profile is still loading
  if (!userProfile) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
            Setting up your account...
          </CardTitle>
          <CardDescription>We're preparing your RepairHQ dashboard. This should only take a moment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading your profile...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to RepairHQ{userProfile.first_name ? `, ${userProfile.first_name}` : ""}!
        </h1>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="capitalize">
            {userProfile.plan || "Starter"} Plan
          </Badge>
          {userProfile.is_trial_active && (
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Trial Active
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No tickets yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No customers yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No items in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/customers/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Add Customer
              </CardTitle>
              <CardDescription>Register a new customer in your system</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/inventory/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-purple-600" />
                Add Inventory Item
              </CardTitle>
              <CardDescription>Add parts and manage your inventory stock</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/work-orders/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Create Work Order
              </CardTitle>
              <CardDescription>Start a new repair ticket</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/customers">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                View Customers
              </CardTitle>
              <CardDescription>Manage your customer database</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/inventory">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-purple-600" />
                View Inventory
              </CardTitle>
              <CardDescription>Check stock levels and manage parts</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/invoices">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-yellow-600" />
                View Invoices
              </CardTitle>
              <CardDescription>Track payments and billing</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Getting Started Section */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Complete these steps to set up your repair shop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Add your first customer</h4>
                    <p className="text-sm text-gray-600">Start by adding customer information</p>
                  </div>
                </div>
                <Link href="/customers/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Set up your inventory</h4>
                    <p className="text-sm text-gray-600">Add parts and supplies to track stock</p>
                  </div>
                </div>
                <Link href="/inventory/new">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Create your first work order</h4>
                    <p className="text-sm text-gray-600">Start tracking repairs</p>
                  </div>
                </div>
                <Link href="/work-orders/new">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Order
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

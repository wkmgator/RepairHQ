"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wrench,
  Users,
  Package,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Tablet,
  Laptop,
  Headphones,
} from "lucide-react"
import Link from "next/link"

export default function HomePage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">RepairHQ</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">The Complete Repair Shop Management System</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your repair business with powerful tools for ticket management, inventory tracking, customer
            relationships, and business analytics. Everything you need in one platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="px-8 py-3">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">14-day free trial • No credit card required</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Run Your Repair Shop</h2>
            <p className="text-lg text-gray-600">Powerful features designed specifically for repair businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Ticket Management</CardTitle>
                <CardDescription>
                  Track repairs from intake to completion with detailed status updates and customer notifications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>
                  Maintain detailed customer profiles with repair history, contact info, and communication logs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Package className="h-10 w-10 text-purple-600 mb-4" />
                <CardTitle>Inventory Control</CardTitle>
                <CardDescription>
                  Manage parts and supplies with automatic reorder alerts and supplier integration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-10 w-10 text-orange-600 mb-4" />
                <CardTitle>Appointment Scheduling</CardTitle>
                <CardDescription>
                  Book and manage appointments with automated reminders and calendar integration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <DollarSign className="h-10 w-10 text-yellow-600 mb-4" />
                <CardTitle>Invoicing & Payments</CardTitle>
                <CardDescription>
                  Generate professional invoices and accept payments with integrated payment processing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-red-600 mb-4" />
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>
                  Track performance with detailed reports on revenue, efficiency, and customer satisfaction
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Device Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Support All Device Types</h2>
            <p className="text-lg text-gray-600">From smartphones to laptops, manage repairs for any device</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Smartphone className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900">Smartphones</h3>
              <p className="text-gray-600">iPhone, Android, and more</p>
            </div>
            <div className="text-center">
              <Tablet className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900">Tablets</h3>
              <p className="text-gray-600">iPad, Android tablets</p>
            </div>
            <div className="text-center">
              <Laptop className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900">Laptops</h3>
              <p className="text-gray-600">MacBook, PC laptops</p>
            </div>
            <div className="text-center">
              <Headphones className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900">Accessories</h3>
              <p className="text-gray-600">Headphones, chargers, cases</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">Choose the plan that fits your business size</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $29<span className="text-lg text-gray-600">/mo</span>
                </div>
                <CardDescription>Perfect for small repair shops</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Up to 100 tickets/month
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Customer management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Basic inventory
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Email support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">Most Popular</Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $79<span className="text-lg text-gray-600">/mo</span>
                </div>
                <CardDescription>For growing repair businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Unlimited tickets
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Multi-location support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Priority support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  $199<span className="text-lg text-gray-600">/mo</span>
                </div>
                <CardDescription>For large repair operations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    Custom training
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing">
              <Button size="lg">View Full Pricing Details</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Repair Business?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of repair shops already using RepairHQ</p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Start Your Free Trial Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Wrench className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold">RepairHQ</span>
              </div>
              <p className="text-gray-400">The complete repair shop management solution.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RepairHQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

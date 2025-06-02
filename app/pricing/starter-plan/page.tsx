"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, ArrowRight, Star, Users, Smartphone } from "lucide-react"
import Link from "next/link"
import { SEOOptimizer } from "@/components/seo-components"

export default function StarterPlanPage() {
  return (
    <>
      <SEOOptimizer
        title="Starter Plan - Mobile Phone Repair Software | RepairHQ"
        description="Perfect for small repair shops. Get started with RepairHQ's Starter Plan at $29/month. 30-day free trial, basic ticket management, inventory tracking, and more."
        keywords={[
          "starter plan mobile repair software",
          "small repair shop software",
          "affordable repair management",
          "basic repair shop system",
          "mobile repair starter package",
          "repair shop software pricing",
          "small business repair software",
          "entry level repair management",
        ]}
        canonicalUrl="https://repairhq.com/pricing/starter-plan"
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Zap className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Starter Plan</h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Perfect for small repair shops just getting started. Everything you need to manage customers, track
                repairs, and grow your business.
              </p>

              <div className="bg-white p-8 rounded-lg shadow-lg mb-12 max-w-md mx-auto">
                <div className="text-center">
                  <span className="text-5xl font-bold text-blue-600">$29</span>
                  <span className="text-gray-600 text-xl">/month</span>
                  <p className="text-green-600 font-medium mt-2">30-day free trial included</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Link href="/auth/signup?plan=starter">
                  <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="px-8">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What's Included</h2>
              <p className="text-xl text-gray-600">Everything you need to get started</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Up to 100 Customers",
                  description: "Manage customer information, contact details, and repair history",
                },
                {
                  icon: Smartphone,
                  title: "Basic Ticket Management",
                  description: "Create, track, and manage repair tickets with status updates",
                },
                {
                  icon: Star,
                  title: "Simple Inventory Tracking",
                  description: "Track parts and accessories with basic stock management",
                },
                {
                  icon: Check,
                  title: "Email Support",
                  description: "Get help when you need it with email support",
                },
                {
                  icon: Users,
                  title: "1 User Account",
                  description: "Perfect for single-person repair shops",
                },
                {
                  icon: Star,
                  title: "Basic Reporting",
                  description: "Essential reports to track your business performance",
                },
                {
                  icon: Smartphone,
                  title: "Mobile App Access",
                  description: "Manage your business on the go with mobile apps",
                },
                {
                  icon: Check,
                  title: "Customer Notifications",
                  description: "Keep customers informed with automated notifications",
                },
                {
                  icon: Star,
                  title: "Basic Templates",
                  description: "Pre-built templates for common repair scenarios",
                },
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Perfect For Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect For</h2>
              <p className="text-xl text-gray-600">Ideal for these types of repair businesses</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Solo Repair Shops",
                  description: "Individual technicians running their own repair business",
                  features: ["Single user account", "Basic customer management", "Simple workflow"],
                },
                {
                  title: "New Repair Businesses",
                  description: "Just starting out and need essential tools to get organized",
                  features: ["Easy setup", "Basic features", "Room to grow"],
                },
                {
                  title: "Small Volume Shops",
                  description: "Handling up to 50 repairs per month with basic needs",
                  features: ["50 tickets/month limit", "Essential tracking", "Cost-effective"],
                },
              ].map((type, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Limitations Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Plan Limitations</h2>
              <p className="text-xl text-gray-600">What you'll need to upgrade for</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Monthly Ticket Limit</span>
                      <Badge variant="outline" className="bg-yellow-100">
                        50 tickets/month
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Template Options</span>
                      <Badge variant="outline" className="bg-yellow-100">
                        Basic templates only
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Analytics</span>
                      <Badge variant="outline" className="bg-yellow-100">
                        No advanced analytics
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <span className="font-medium">API Access</span>
                      <Badge variant="outline" className="bg-yellow-100">
                        Not included
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Custom Branding</span>
                      <Badge variant="outline" className="bg-yellow-100">
                        Not available
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">Need more features?</p>
                    <Link href="/pricing/pro-plan">
                      <Button variant="outline">
                        Upgrade to Pro Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">Start your 30-day free trial today. No credit card required.</p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Link href="/auth/signup?plan=starter">
                <Button size="lg" variant="secondary" className="px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact Sales
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">30-day free trial • No setup fees • Cancel anytime</p>
          </div>
        </section>
      </div>
    </>
  )
}

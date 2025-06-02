"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, ArrowRight, Users, Smartphone, Zap } from "lucide-react"
import Link from "next/link"
import { SEOOptimizer } from "@/components/seo-components"

export default function ProPlanPage() {
  return (
    <>
      <SEOOptimizer
        title="Pro Plan - Advanced Mobile Repair Software | RepairHQ"
        description="Most popular plan for growing repair businesses. RepairHQ Pro Plan at $59/month includes unlimited customers, advanced analytics, multi-location support, and more."
        keywords={[
          "pro plan mobile repair software",
          "advanced repair shop software",
          "growing repair business software",
          "unlimited customers repair software",
          "multi-location repair management",
          "advanced repair analytics",
          "professional repair shop system",
          "repair business growth software",
        ]}
        canonicalUrl="https://repairhq.com/pricing/pro-plan"
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Star className="h-12 w-12 text-blue-600" />
                </div>
                <Badge className="ml-4 bg-blue-500 text-white">Most Popular</Badge>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Pro Plan</h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                The most popular choice for growing repair businesses. Advanced features, unlimited customers, and
                everything you need to scale.
              </p>

              <div className="bg-white p-8 rounded-lg shadow-lg mb-12 max-w-md mx-auto border-2 border-blue-500">
                <div className="text-center">
                  <span className="text-5xl font-bold text-blue-600">$59</span>
                  <span className="text-gray-600 text-xl">/month</span>
                  <p className="text-green-600 font-medium mt-2">30-day free trial included</p>
                  <p className="text-blue-600 font-medium">Save $708 annually</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Link href="/auth/signup?plan=pro">
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything in Starter, Plus</h2>
              <p className="text-xl text-gray-600">Advanced features for growing businesses</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Unlimited Customers",
                  description: "No limits on customer database size or growth",
                },
                {
                  icon: Smartphone,
                  title: "Advanced Ticket Management",
                  description: "Custom fields, workflows, and advanced tracking",
                },
                {
                  icon: Star,
                  title: "Full Inventory Management",
                  description: "Advanced stock control, suppliers, and purchasing",
                },
                {
                  icon: Check,
                  title: "Priority Support",
                  description: "Email and chat support with faster response times",
                },
                {
                  icon: Users,
                  title: "Up to 5 User Accounts",
                  description: "Perfect for small teams with role-based access",
                },
                {
                  icon: Star,
                  title: "Advanced Analytics",
                  description: "Detailed reports, trends, and business insights",
                },
                {
                  icon: Smartphone,
                  title: "Customer Portal",
                  description: "Let customers track repairs and communicate",
                },
                {
                  icon: Zap,
                  title: "Automated Workflows",
                  description: "Automate repetitive tasks and processes",
                },
                {
                  icon: Check,
                  title: "SMS Notifications",
                  description: "Keep customers updated via text messages",
                },
                {
                  icon: Star,
                  title: "Custom Templates",
                  description: "Create custom forms and repair templates",
                },
                {
                  icon: Smartphone,
                  title: "Barcode Scanning",
                  description: "Quick inventory and device identification",
                },
                {
                  icon: Users,
                  title: "Multi-Location (up to 3)",
                  description: "Manage multiple shop locations from one account",
                },
                {
                  icon: Zap,
                  title: "API Access",
                  description: "Integrate with other business tools and systems",
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
              <p className="text-xl text-gray-600">Ideal for these growing repair businesses</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Growing Repair Shops",
                  description: "Businesses expanding beyond basic needs with more customers",
                  features: ["Unlimited customers", "Advanced workflows", "Team collaboration"],
                },
                {
                  title: "Multi-Location Businesses",
                  description: "Managing 2-3 repair shop locations from one system",
                  features: ["Up to 3 locations", "Centralized management", "Location analytics"],
                },
                {
                  title: "Professional Operations",
                  description: "Businesses wanting advanced features and customer experience",
                  features: ["Customer portal", "SMS notifications", "Advanced reporting"],
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

        {/* Comparison Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Pro vs Starter</h2>
              <p className="text-xl text-gray-600">See what you get with the upgrade</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">Starter Plan</CardTitle>
                    <div className="text-3xl font-bold text-gray-600">$29/month</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Up to 100 customers</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>50 tickets/month limit</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>1 user account</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Basic reporting</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Email support</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-500">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">Pro Plan</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">$59/month</div>
                    <Badge className="bg-blue-500">Most Popular</Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Unlimited customers</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Unlimited tickets</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Up to 5 user accounts</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Priority support</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Customer portal</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>SMS notifications</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3" />
                        <span>Multi-location (up to 3)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of repair shops using RepairHQ Pro to scale their operations.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Link href="/auth/signup?plan=pro">
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

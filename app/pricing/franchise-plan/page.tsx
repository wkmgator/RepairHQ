"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Building,
  ArrowRight,
  Users,
  Smartphone,
  Zap,
  Shield,
  Phone,
  Settings,
  Crown,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { SEOOptimizer } from "@/components/seo-components"

export default function FranchisePlanPage() {
  return (
    <>
      <SEOOptimizer
        title="Franchise Plan - Complete Multi-Brand Repair Software | RepairHQ"
        description="Complete solution for franchise operations. RepairHQ Franchise Plan at $199/month includes unlimited franchises, white-label solution, franchise management tools, and 24/7 support."
        keywords={[
          "franchise repair software",
          "multi-brand repair system",
          "franchise management software",
          "white-label repair solution",
          "franchise operations software",
          "multi-location franchise system",
          "franchise compliance software",
          "repair franchise platform",
        ]}
        canonicalUrl="https://repairhq.com/pricing/franchise-plan"
      />

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-green-100 rounded-full">
                  <Building className="h-12 w-12 text-green-600" />
                </div>
                <Badge className="ml-4 bg-green-500 text-white">Complete Solution</Badge>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Franchise Plan</h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Complete solution for franchise operations and multi-brand businesses. Everything you need to manage
                unlimited franchises with full white-label capabilities.
              </p>

              <div className="bg-white p-8 rounded-lg shadow-lg mb-12 max-w-md mx-auto border-2 border-green-500">
                <div className="text-center">
                  <span className="text-5xl font-bold text-green-600">$199</span>
                  <span className="text-gray-600 text-xl">/month</span>
                  <p className="text-green-600 font-medium mt-2">30-day free trial included</p>
                  <p className="text-green-600 font-medium">Save $2,388 annually</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Link href="/auth/signup?plan=franchise">
                  <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700">
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything in Enterprise, Plus</h2>
              <p className="text-xl text-gray-600">Franchise-specific features for multi-brand operations</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Building,
                  title: "Unlimited Franchises",
                  description: "Manage any number of franchise locations and brands",
                },
                {
                  icon: TrendingUp,
                  title: "Franchise Management Tools",
                  description: "Complete suite of franchise operation management",
                },
                {
                  icon: Smartphone,
                  title: "Centralized Reporting",
                  description: "Cross-franchise analytics and performance tracking",
                },
                {
                  icon: Crown,
                  title: "White-Label Solution",
                  description: "Complete branding customization for each franchise",
                },
                {
                  icon: Users,
                  title: "Multi-Brand Support",
                  description: "Support multiple brands under one platform",
                },
                {
                  icon: TrendingUp,
                  title: "Franchise Performance Analytics",
                  description: "Detailed performance metrics for each franchise",
                },
                {
                  icon: Settings,
                  title: "Territory Management",
                  description: "Manage franchise territories and boundaries",
                },
                {
                  icon: Zap,
                  title: "Royalty Tracking",
                  description: "Automated royalty calculation and tracking",
                },
                {
                  icon: Users,
                  title: "Franchise Onboarding System",
                  description: "Streamlined onboarding for new franchisees",
                },
                {
                  icon: Crown,
                  title: "Custom Franchise Portal",
                  description: "Dedicated portal for franchisee management",
                },
                {
                  icon: Phone,
                  title: "Dedicated Franchise Support",
                  description: "Specialized support team for franchise operations",
                },
                {
                  icon: Shield,
                  title: "24/7 Phone Support",
                  description: "Round-the-clock support for critical operations",
                },
                {
                  icon: Settings,
                  title: "Custom Development",
                  description: "Bespoke features for franchise requirements",
                },
                {
                  icon: Shield,
                  title: "Franchise Compliance Tools",
                  description: "Ensure all franchises meet brand standards",
                },
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
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
              <p className="text-xl text-gray-600">Ideal for these franchise operations</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Franchise Brands",
                  description: "Established franchise brands with multiple franchisees",
                  features: ["Unlimited franchises", "Brand compliance", "Centralized control"],
                },
                {
                  title: "Multi-Brand Operations",
                  description: "Companies operating multiple repair brands or concepts",
                  features: ["Multi-brand support", "Separate branding", "Cross-brand analytics"],
                },
                {
                  title: "Large Franchise Networks",
                  description: "Extensive franchise networks requiring sophisticated management",
                  features: ["Territory management", "Royalty tracking", "Performance analytics"],
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

        {/* Franchise Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Franchise Management Benefits</h2>
              <p className="text-xl text-gray-600">What makes our franchise solution unique</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8">
                <div className="flex items-center mb-4">
                  <Building className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold">Complete Franchise Control</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Manage all aspects of your franchise network from one central platform.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Centralized franchise management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Territory and boundary management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Franchise compliance monitoring</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold">Advanced Analytics</h3>
                </div>
                <p className="text-gray-600 mb-4">Deep insights into franchise performance and network health.</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Cross-franchise performance comparison</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Royalty and revenue tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Network-wide trend analysis</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center mb-4">
                  <Crown className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold">White-Label Customization</h3>
                </div>
                <p className="text-gray-600 mb-4">Complete branding control for each franchise location.</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Individual franchise branding</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Custom domains per franchise</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Branded customer portals</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-bold">Franchisee Support</h3>
                </div>
                <p className="text-gray-600 mb-4">Comprehensive support system for franchisee success.</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Dedicated franchisee onboarding</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Ongoing training and support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Best practice sharing</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* ROI Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Franchise ROI</h2>
              <p className="text-xl text-gray-600">See the return on investment for franchise operations</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8">
                <div className="text-4xl font-bold text-green-600 mb-2">35%</div>
                <div className="text-lg font-medium mb-2">Average Revenue Increase</div>
                <p className="text-gray-600">Franchises see significant revenue growth with our platform</p>
              </Card>

              <Card className="text-center p-8">
                <div className="text-4xl font-bold text-green-600 mb-2">60%</div>
                <div className="text-lg font-medium mb-2">Operational Efficiency</div>
                <p className="text-gray-600">Streamlined operations across all franchise locations</p>
              </Card>

              <Card className="text-center p-8">
                <div className="text-4xl font-bold text-green-600 mb-2">90%</div>
                <div className="text-lg font-medium mb-2">Franchisee Satisfaction</div>
                <p className="text-gray-600">High satisfaction rates among franchise owners</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Scale Your Franchise?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join successful franchise brands using RepairHQ to manage their operations.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Link href="/auth/signup?plan=franchise">
                <Button size="lg" variant="secondary" className="px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-green-600"
              >
                Contact Franchise Team
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              30-day free trial • Franchise specialist onboarding • Cancel anytime
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

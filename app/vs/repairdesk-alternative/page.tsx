"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Star, ArrowRight, Zap, DollarSign, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import { SEOOptimizer, generateSoftwareApplicationSchema } from "@/components/seo-components"

const comparisonFeatures = [
  {
    feature: "AI-Powered Diagnostics",
    repairHQ: true,
    repairDesk: false,
    description: "Automated device diagnosis with machine learning",
  },
  {
    feature: "Real-time Inventory Tracking",
    repairHQ: true,
    repairDesk: "Limited",
    description: "Smart inventory management with auto-reordering",
  },
  {
    feature: "Multi-location Management",
    repairHQ: true,
    repairDesk: "Basic",
    description: "Centralized management for multiple locations",
  },
  {
    feature: "Advanced Analytics",
    repairHQ: true,
    repairDesk: "Basic",
    description: "Comprehensive business intelligence and reporting",
  },
  {
    feature: "Mobile App (iOS/Android)",
    repairHQ: true,
    repairDesk: "Limited",
    description: "Full-featured mobile applications",
  },
  {
    feature: "API Integration",
    repairHQ: true,
    repairDesk: "Limited",
    description: "Extensive API for custom integrations",
  },
  {
    feature: "Blockchain Warranty",
    repairHQ: true,
    repairDesk: false,
    description: "Immutable warranty certificates",
  },
  {
    feature: "24/7 Support",
    repairHQ: true,
    repairDesk: "Business hours only",
    description: "Round-the-clock customer support",
  },
]

const pricingComparison = [
  {
    feature: "Starting Price",
    repairHQ: "$29/month",
    repairDesk: "$49/month",
    savings: "41% cheaper",
  },
  {
    feature: "Setup Fee",
    repairHQ: "Free",
    repairDesk: "$199",
    savings: "Save $199",
  },
  {
    feature: "Training",
    repairHQ: "Free",
    repairDesk: "$299",
    savings: "Save $299",
  },
  {
    feature: "Data Migration",
    repairHQ: "Free",
    repairDesk: "$99",
    savings: "Save $99",
  },
]

export default function RepairDeskAlternativePage() {
  return (
    <>
      <SEOOptimizer
        title="RepairDesk Alternative - RepairHQ: 50% More Features, 41% Lower Cost"
        description="Switch from RepairDesk to RepairHQ and get AI diagnostics, advanced analytics, and 24/7 support at 41% lower cost. Free migration included. Try free for 14 days."
        keywords={[
          "RepairDesk alternative",
          "RepairDesk vs RepairHQ",
          "mobile repair software comparison",
          "better than RepairDesk",
          "RepairDesk competitor",
          "repair shop software alternative",
          "switch from RepairDesk",
          "RepairDesk replacement",
        ]}
        canonicalUrl="https://repairhq.com/vs/repairdesk-alternative"
        structuredData={generateSoftwareApplicationSchema()}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">RepairHQ</span>
                <Badge variant="outline">RepairDesk Alternative</Badge>
              </Link>
              <div className="flex items-center space-x-4">
                <Button variant="outline">Compare Features</Button>
                <Button>Start Free Trial</Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4 bg-red-100 text-red-800">RepairDesk Users Save 41%</Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                The Best{" "}
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RepairDesk Alternative
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Get 50% more features than RepairDesk at 41% lower cost. AI-powered diagnostics, advanced analytics, and
                24/7 support included. Free migration from RepairDesk guaranteed.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-12">
                <Button size="lg" className="px-8">
                  Switch from RepairDesk Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Compare Side-by-Side
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">41%</div>
                  <div className="text-gray-600">Lower Cost</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">50%</div>
                  <div className="text-gray-600">More Features</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Switch Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why 2,000+ Shops Switched from RepairDesk</h2>
              <p className="text-xl text-gray-600">See what you're missing with RepairDesk</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">AI Diagnostics</h3>
                  <p className="text-sm text-gray-600">RepairDesk lacks AI-powered device diagnostics</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Lower Costs</h3>
                  <p className="text-sm text-gray-600">Save 41% on monthly fees plus setup costs</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Better Support</h3>
                  <p className="text-sm text-gray-600">24/7 support vs RepairDesk's business hours only</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <BarChart3 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Advanced Analytics</h3>
                  <p className="text-sm text-gray-600">Deep business insights RepairDesk can't provide</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">RepairHQ vs RepairDesk: Feature Comparison</h2>
              <p className="text-xl text-gray-600">See exactly what you get with each platform</p>
            </div>

            <div className="max-w-6xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium">Feature</th>
                          <th className="text-center p-4 font-medium text-blue-600">RepairHQ</th>
                          <th className="text-center p-4 font-medium text-gray-600">RepairDesk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonFeatures.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-4">
                              <div>
                                <div className="font-medium">{item.feature}</div>
                                <div className="text-sm text-gray-600">{item.description}</div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              {item.repairHQ === true ? (
                                <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-sm text-gray-600">{item.repairHQ}</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {item.repairDesk === true ? (
                                <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                              ) : item.repairDesk === false ? (
                                <X className="h-6 w-6 text-red-500 mx-auto" />
                              ) : (
                                <span className="text-sm text-gray-600">{item.repairDesk}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing: RepairHQ vs RepairDesk</h2>
              <p className="text-xl text-gray-600">Save thousands by switching to RepairHQ</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium">Cost Item</th>
                          <th className="text-center p-4 font-medium text-blue-600">RepairHQ</th>
                          <th className="text-center p-4 font-medium text-gray-600">RepairDesk</th>
                          <th className="text-center p-4 font-medium text-green-600">Your Savings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pricingComparison.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-4 font-medium">{item.feature}</td>
                            <td className="p-4 text-center font-medium text-blue-600">{item.repairHQ}</td>
                            <td className="p-4 text-center font-medium text-gray-600">{item.repairDesk}</td>
                            <td className="p-4 text-center font-medium text-green-600">{item.savings}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center mt-8">
                <div className="text-3xl font-bold text-green-600 mb-2">Save $597+ in Year 1</div>
                <p className="text-gray-600">Plus ongoing monthly savings of 41%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Migration Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Free Migration from RepairDesk</h2>
              <p className="text-xl text-gray-600">
                We'll handle everything - data migration, setup, and training at no cost
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-bold mb-2">Export Your Data</h3>
                  <p className="text-sm text-gray-600">We'll help you export all your RepairDesk data safely</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-bold mb-2">Free Migration</h3>
                  <p className="text-sm text-gray-600">Our team migrates everything to RepairHQ at no charge</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-bold mb-2">Go Live</h3>
                  <p className="text-sm text-gray-600">Start using RepairHQ with all your data intact</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="px-8">
                Start Free Migration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-gray-600 mt-2">Migration typically completed within 24 hours</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What RepairDesk Users Say After Switching</h2>
              <p className="text-xl text-gray-600">Real feedback from shops that made the switch</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "Switched from RepairDesk to RepairHQ and couldn't be happier. The AI diagnostics alone saves us 2
                    hours per day. Plus we're saving $200/month!"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-medium">Mike Chen</div>
                    <div className="text-sm text-gray-600">TechFix Pro, Seattle</div>
                    <div className="text-sm text-green-600 font-medium">Former RepairDesk User</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "RepairDesk was holding us back. RepairHQ's advanced analytics and inventory management are game
                    changers. Migration was seamless!"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-medium">Sarah Rodriguez</div>
                    <div className="text-sm text-gray-600">Mobile Masters, Austin</div>
                    <div className="text-sm text-green-600 font-medium">Former RepairDesk User</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "Best decision we made was leaving RepairDesk for RepairHQ. Better features, lower cost, and amazing
                    support. Wish we switched sooner!"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-medium">David Kim</div>
                    <div className="text-sm text-gray-600">QuickFix Solutions, Miami</div>
                    <div className="text-sm text-green-600 font-medium">Former RepairDesk User</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Leave RepairDesk Behind?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join 2,000+ repair shops who switched to RepairHQ for better features and lower costs
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Migration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Compare Features
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              14-day free trial • Free migration • No setup fees • Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl font-bold">RepairHQ</span>
                  <Badge variant="outline" className="text-white border-white">
                    RepairDesk Alternative
                  </Badge>
                </div>
                <p className="text-gray-400 mb-4">
                  The superior RepairDesk alternative. 50% more features at 41% lower cost.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Why Switch</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>AI-Powered Diagnostics</li>
                  <li>Advanced Analytics</li>
                  <li>24/7 Support</li>
                  <li>Lower Costs</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Migration</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Free Data Migration</li>
                  <li>Expert Setup</li>
                  <li>Training Included</li>
                  <li>24-Hour Turnaround</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Get Started</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/pricing">View Pricing</Link>
                  </li>
                  <li>
                    <Link href="/demo">Request Demo</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact Sales</Link>
                  </li>
                  <li>
                    <Link href="/help">Support</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 RepairHQ. The best RepairDesk alternative for mobile phone repair shops.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

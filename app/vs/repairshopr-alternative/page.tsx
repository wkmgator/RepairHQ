"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, ArrowRight, Smartphone, Zap, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import { SEOOptimizer, generateSoftwareApplicationSchema } from "@/components/seo-components"

export default function RepairShoprAlternativePage() {
  return (
    <>
      <SEOOptimizer
        title="RepairShopr Alternative - RepairHQ: Modern UI with AI Features"
        description="Upgrade from RepairShopr's outdated interface to RepairHQ's modern platform with AI diagnostics, advanced features, and better pricing. Free migration included."
        keywords={[
          "RepairShopr alternative",
          "RepairShopr vs RepairHQ",
          "modern repair shop software",
          "better than RepairShopr",
          "RepairShopr competitor",
          "upgrade from RepairShopr",
          "RepairShopr replacement",
          "AI repair software",
        ]}
        canonicalUrl="https://repairhq.com/vs/repairshopr-alternative"
        structuredData={generateSoftwareApplicationSchema()}
      />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Smartphone className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">RepairHQ</span>
                <Badge variant="outline">RepairShopr Alternative</Badge>
              </Link>
              <div className="flex items-center space-x-4">
                <Button variant="outline">See Comparison</Button>
                <Button className="bg-purple-600 hover:bg-purple-700">Start Free Trial</Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4 bg-purple-100 text-purple-800">Modern RepairShopr Alternative</Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Upgrade from{" "}
                <span className="text-purple-600 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  RepairShopr's Outdated Interface
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Modern UI, AI-powered diagnostics, and advanced features RepairShopr can't match. Join 1,500+ shops who
                upgraded from RepairShopr to RepairHQ for better technology and user experience.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-12">
                <Button size="lg" className="px-8 bg-purple-600 hover:bg-purple-700">
                  Upgrade from RepairShopr
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  See Side-by-Side Demo
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600">Modern</div>
                  <div className="text-gray-600">User Interface</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">AI-Powered</div>
                  <div className="text-gray-600">Diagnostics</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">Advanced</div>
                  <div className="text-gray-600">Features</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Upgrade Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why 1,500+ Shops Upgraded from RepairShopr</h2>
              <p className="text-xl text-gray-600">RepairShopr's limitations are holding your business back</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">RepairShopr's Problems:</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <X className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <div className="font-medium">Outdated Interface</div>
                      <div className="text-sm text-gray-600">Clunky, slow, and hard to navigate</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <X className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <div className="font-medium">No AI Features</div>
                      <div className="text-sm text-gray-600">Manual diagnostics waste time</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <X className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <div className="font-medium">Limited Integrations</div>
                      <div className="text-sm text-gray-600">Doesn't connect with modern tools</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <X className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <div className="font-medium">Poor Mobile Experience</div>
                      <div className="text-sm text-gray-600">Mobile app is barely functional</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">RepairHQ's Solutions:</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <div className="font-medium">Modern, Intuitive UI</div>
                      <div className="text-sm text-gray-600">Fast, beautiful, and easy to use</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <div className="font-medium">AI-Powered Diagnostics</div>
                      <div className="text-sm text-gray-600">Automated device analysis saves hours</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <div className="font-medium">Extensive Integrations</div>
                      <div className="text-sm text-gray-600">Connect with 100+ business tools</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <div className="font-medium">Full-Featured Mobile Apps</div>
                      <div className="text-sm text-gray-600">Complete functionality on iOS and Android</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Features RepairShopr Doesn't Have</h2>
              <p className="text-xl text-gray-600">See what you're missing with RepairShopr</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">AI Diagnostics</h3>
                  <p className="text-sm text-gray-600">Automated device analysis and repair recommendations</p>
                  <Badge className="mt-2 bg-red-100 text-red-800">Not in RepairShopr</Badge>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Advanced Analytics</h3>
                  <p className="text-sm text-gray-600">Deep business insights and predictive analytics</p>
                  <Badge className="mt-2 bg-red-100 text-red-800">Not in RepairShopr</Badge>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Smartphone className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Modern Mobile Apps</h3>
                  <p className="text-sm text-gray-600">Full-featured iOS and Android applications</p>
                  <Badge className="mt-2 bg-red-100 text-red-800">Limited in RepairShopr</Badge>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Customer Portal</h3>
                  <p className="text-sm text-gray-600">Self-service portal for customers</p>
                  <Badge className="mt-2 bg-red-100 text-red-800">Not in RepairShopr</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Migration CTA */}
        <section className="py-20 bg-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Upgrade from RepairShopr?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join 1,500+ repair shops who upgraded to RepairHQ for modern features and better user experience
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Migration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-purple-600"
              >
                See Live Demo
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              14-day free trial • Free migration from RepairShopr • No setup fees
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

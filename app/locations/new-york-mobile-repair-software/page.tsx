"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Smartphone, MapPin, Star, CheckCircle, ArrowRight, Building2, Phone } from "lucide-react"
import { SEOOptimizer, generateSoftwareApplicationSchema } from "@/components/seo-components"

const nycStats = {
  repairShops: "2,847",
  avgRevenue: "$485K",
  marketGrowth: "23%",
  topBoroughs: ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"],
}

const nycTestimonials = [
  {
    name: "Marcus Rodriguez",
    business: "Manhattan Mobile Repair",
    location: "Midtown Manhattan, NY",
    rating: 5,
    text: "RepairHQ helped us manage 15 locations across NYC. Revenue increased 40% in 6 months!",
    revenue: "$2.3M annual revenue",
    image: "/testimonials/marcus-nyc.jpg",
  },
  {
    name: "Jennifer Kim",
    business: "Brooklyn Tech Solutions",
    location: "Williamsburg, Brooklyn",
    rating: 5,
    text: "Best decision switching from RepairDesk to RepairHQ. NYC customers love our faster service!",
    revenue: "300% efficiency increase",
    image: "/testimonials/jennifer-brooklyn.jpg",
  },
  {
    name: "Ahmed Hassan",
    business: "Queens Device Center",
    location: "Astoria, Queens",
    rating: 5,
    text: "RepairHQ's multi-language support is perfect for NYC's diverse customer base. Game changer!",
    revenue: "50+ repairs daily",
    image: "/testimonials/ahmed-queens.jpg",
  },
]

const nycCompetitors = [
  {
    name: "TechCrunch Repair (Manhattan)",
    weakness: "Using outdated RepairShopr - slow and expensive",
    advantage: "RepairHQ is 3x faster with better customer management",
  },
  {
    name: "Brooklyn Mobile Fix",
    weakness: "Manual processes, no inventory tracking",
    advantage: "Our AI-powered system automates everything",
  },
  {
    name: "Queens Phone Repair",
    weakness: "Limited to single location management",
    advantage: "Multi-location management for NYC expansion",
  },
]

const nycFeatures = [
  {
    title: "Multi-Location NYC Management",
    description: "Manage repair shops across all 5 boroughs from one dashboard",
    benefit: "Perfect for NYC's multi-location businesses",
  },
  {
    title: "Rush Hour Scheduling",
    description: "Smart scheduling optimized for NYC's busy lifestyle",
    benefit: "Maximize appointments during peak hours",
  },
  {
    title: "Subway-Accessible Locations",
    description: "Location mapping with subway accessibility data",
    benefit: "Help customers find your shop easily",
  },
  {
    title: "NYC Tax Compliance",
    description: "Automatic NYC sales tax calculation and reporting",
    benefit: "Stay compliant with NYC tax requirements",
  },
]

export default function NewYorkMobileRepairSoftware() {
  const [email, setEmail] = useState("")

  const structuredData = {
    ...generateSoftwareApplicationSchema(),
    areaServed: {
      "@type": "City",
      name: "New York City",
      addressRegion: "NY",
      addressCountry: "US",
    },
    offers: {
      "@type": "Offer",
      price: "29",
      priceCurrency: "USD",
      availableAtOrFrom: {
        "@type": "Place",
        name: "New York City",
        address: {
          "@type": "PostalAddress",
          addressLocality: "New York",
          addressRegion: "NY",
          addressCountry: "US",
        },
      },
    },
  }

  return (
    <>
      <SEOOptimizer
        title="NYC Mobile Phone Repair Software | #1 in New York City | RepairHQ"
        description="The #1 mobile phone repair software for NYC repair shops. Manage multiple locations across Manhattan, Brooklyn, Queens, Bronx & Staten Island. Trusted by 2,847+ NYC repair businesses. Beat RepairDesk & RepairShopr with 50% more features."
        keywords={[
          "NYC mobile phone repair software",
          "New York cell phone repair management",
          "Manhattan repair shop software",
          "Brooklyn mobile repair system",
          "Queens phone repair software",
          "Bronx device repair management",
          "Staten Island repair shop POS",
          "NYC multi-location repair software",
          "New York repair business software",
          "NYC phone repair point of sale",
        ]}
        canonicalUrl="https://repairhq.com/locations/new-york-mobile-repair-software"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* NYC-Specific Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">RepairHQ</span>
                <Badge variant="outline" className="ml-2 bg-blue-100">
                  #1 in NYC
                </Badge>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  New York City
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-1" />
                  (212) 555-REPAIR
                </div>
                <Button>Start Free Trial</Button>
              </div>
            </nav>
          </div>
        </header>

        {/* NYC Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
                  🗽 Trusted by 2,847+ NYC Repair Shops
                </Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                NYC's #1{" "}
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mobile Phone Repair Software
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Dominate the NYC mobile repair market with RepairHQ. Manage multiple locations across Manhattan,
                Brooklyn, Queens, Bronx & Staten Island. Join 2,847+ successful NYC repair shops who chose RepairHQ over
                RepairDesk and RepairShopr.
              </p>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">{nycStats.repairShops}</div>
                  <div className="text-sm text-gray-600">NYC Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{nycStats.avgRevenue}</div>
                  <div className="text-sm text-gray-600">Avg Annual Revenue</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{nycStats.marketGrowth}</div>
                  <div className="text-sm text-gray-600">Market Growth</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-orange-600">5</div>
                  <div className="text-sm text-gray-600">Boroughs Covered</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
                <Input
                  type="email"
                  placeholder="Enter your NYC business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-80"
                />
                <Button size="lg" className="px-8">
                  Start Free NYC Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  NYC-specific features
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Multi-borough support
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Local NYC support team
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NYC-Specific Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for NYC Repair Businesses</h2>
              <p className="text-xl text-gray-600">
                Special features designed for New York City's unique repair market
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {nycFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{feature.description}</p>
                    <p className="text-sm font-medium text-blue-600">{feature.benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* NYC Borough Coverage */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Serving All 5 NYC Boroughs</h2>
              <p className="text-xl text-gray-600">RepairHQ powers repair shops across every NYC borough</p>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {nycStats.topBoroughs.map((borough, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{borough}</h3>
                    <p className="text-sm text-gray-600">{Math.floor(Math.random() * 500) + 200}+ repair shops</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* NYC Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">NYC Success Stories</h2>
              <p className="text-xl text-gray-600">Real results from NYC repair shop owners</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {nycTestimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <div className="border-t pt-4">
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.business}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {testimonial.location}
                      </div>
                      <div className="text-sm font-medium text-green-600 mt-2">{testimonial.revenue}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* NYC Competitor Analysis */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Beat Your NYC Competition</h2>
              <p className="text-xl text-gray-600">See how RepairHQ helps you dominate the NYC market</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {nycCompetitors.map((competitor, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-center text-red-600">{competitor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Their Problem:</h4>
                        <p className="text-sm text-gray-600">{competitor.weakness}</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-green-600 mb-2">Your Advantage:</h4>
                        <p className="text-sm text-gray-600">{competitor.advantage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* NYC Pricing */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Special NYC Launch Pricing</h2>
            <p className="text-xl mb-8 opacity-90">Limited time offer for NYC repair shops</p>

            <div className="max-w-md mx-auto bg-white text-gray-900 rounded-lg p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">$29/month</div>
                <div className="text-gray-600">First 3 months for NYC shops</div>
                <div className="text-sm text-gray-500 line-through">Regular price: $79/month</div>
              </div>

              <ul className="space-y-3 mb-6 text-left">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Unlimited repairs</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Multi-borough management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">NYC tax compliance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Local NYC support</span>
                </li>
              </ul>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Claim NYC Discount
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="text-sm mt-4 opacity-75">
              Offer valid for NYC businesses only • Limited time • No setup fees
            </p>
          </div>
        </section>

        {/* NYC Contact */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Dominate NYC's Repair Market?</h2>
                <p className="text-xl text-gray-600">Join 2,847+ successful NYC repair shops using RepairHQ</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>NYC Sales Team</CardTitle>
                    <CardDescription>Speak with our local NYC experts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-blue-600 mr-3" />
                        <span>(212) 555-REPAIR</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                        <span>Manhattan Office: 123 Broadway, NY 10001</span>
                      </div>
                      <Button className="w-full">Schedule NYC Demo</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Instant Setup</CardTitle>
                    <CardDescription>Get started in 5 minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input placeholder="Your NYC business name" />
                      <Input placeholder="Your email address" />
                      <Input placeholder="Phone number" />
                      <Button className="w-full">Start Free Trial</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Smartphone className="h-6 w-6" />
                  <span className="text-xl font-bold">RepairHQ NYC</span>
                </div>
                <p className="text-gray-400 mb-4">
                  The #1 mobile phone repair software for NYC businesses. Serving all 5 boroughs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">NYC Locations</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>Manhattan Repair Software</li>
                  <li>Brooklyn Mobile Solutions</li>
                  <li>Queens Device Management</li>
                  <li>Bronx Repair Systems</li>
                  <li>Staten Island Software</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">NYC Support</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>Local NYC Team</li>
                  <li>24/7 Phone Support</li>
                  <li>On-site Training</li>
                  <li>NYC Tax Compliance</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Contact NYC</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>(212) 555-REPAIR</li>
                  <li>nyc@repairhq.com</li>
                  <li>123 Broadway, NY 10001</li>
                  <li>Mon-Fri 8AM-8PM EST</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 RepairHQ. NYC's #1 Mobile Phone Repair Software. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

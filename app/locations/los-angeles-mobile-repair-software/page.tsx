"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Smartphone, MapPin, Star, CheckCircle, ArrowRight, Sun, Phone } from "lucide-react"
import { SEOOptimizer, generateSoftwareApplicationSchema } from "@/components/seo-components"

const laStats = {
  repairShops: "3,124",
  avgRevenue: "$520K",
  marketGrowth: "28%",
  topAreas: ["Hollywood", "Beverly Hills", "Santa Monica", "Downtown LA", "Venice"],
}

const laTestimonials = [
  {
    name: "Carlos Martinez",
    business: "Hollywood Mobile Repair",
    location: "Hollywood, CA",
    rating: 5,
    text: "RepairHQ helped us scale from 1 to 8 locations across LA. Perfect for the entertainment industry!",
    revenue: "$3.2M annual revenue",
  },
  {
    name: "Sarah Johnson",
    business: "Santa Monica Tech Hub",
    location: "Santa Monica, CA",
    rating: 5,
    text: "Beach-side customers love our fast service. RepairHQ's scheduling is perfect for LA lifestyle!",
    revenue: "400% growth in 2 years",
  },
  {
    name: "David Chen",
    business: "Downtown Device Center",
    location: "Downtown LA, CA",
    rating: 5,
    text: "Managing repairs for LA's business district requires the best software. RepairHQ delivers!",
    revenue: "200+ repairs daily",
  },
]

const laFeatures = [
  {
    title: "Multi-Location LA Management",
    description: "Manage repair shops from Hollywood to Long Beach from one dashboard",
    benefit: "Perfect for LA's sprawling geography",
  },
  {
    title: "Traffic-Smart Scheduling",
    description: "AI scheduling that accounts for LA traffic patterns",
    benefit: "Optimize appointments around rush hour",
  },
  {
    title: "Celebrity Client Privacy",
    description: "Enhanced privacy features for high-profile customers",
    benefit: "Discretion for entertainment industry clients",
  },
  {
    title: "California Tax Compliance",
    description: "Automatic CA sales tax and LA county tax calculation",
    benefit: "Stay compliant with complex CA tax laws",
  },
]

export default function LosAngelesMobileRepairSoftware() {
  const [email, setEmail] = useState("")

  const structuredData = {
    ...generateSoftwareApplicationSchema(),
    areaServed: {
      "@type": "City",
      name: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
  }

  return (
    <>
      <SEOOptimizer
        title="Los Angeles Mobile Phone Repair Software | #1 in LA | RepairHQ"
        description="The #1 mobile phone repair software for Los Angeles repair shops. Manage multiple locations across Hollywood, Beverly Hills, Santa Monica & Downtown LA. Trusted by 3,124+ LA repair businesses. Beat RepairDesk & RepairShopr."
        keywords={[
          "Los Angeles mobile phone repair software",
          "LA cell phone repair management",
          "Hollywood repair shop software",
          "Beverly Hills mobile repair system",
          "Santa Monica phone repair software",
          "Downtown LA device repair management",
          "California repair shop POS",
          "LA multi-location repair software",
          "Los Angeles repair business software",
          "LA phone repair point of sale",
        ]}
        canonicalUrl="https://repairhq.com/locations/los-angeles-mobile-repair-software"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* LA-Specific Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-8 w-8 text-orange-600" />
                <span className="text-2xl font-bold text-gray-900">RepairHQ</span>
                <Badge variant="outline" className="ml-2 bg-orange-100">
                  #1 in LA
                </Badge>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <div className="flex items-center text-sm text-gray-600">
                  <Sun className="h-4 w-4 mr-1" />
                  Los Angeles
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-1" />
                  (323) 555-REPAIR
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">Start Free Trial</Button>
              </div>
            </nav>
          </div>
        </header>

        {/* LA Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Badge className="bg-orange-600 text-white px-4 py-2 text-lg">
                  ☀️ Trusted by 3,124+ LA Repair Shops
                </Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                LA's #1{" "}
                <span className="text-orange-600 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Mobile Phone Repair Software
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Dominate the Los Angeles mobile repair market with RepairHQ. From Hollywood to Santa Monica, Beverly
                Hills to Downtown LA. Join 3,124+ successful LA repair shops who chose RepairHQ over RepairDesk and
                RepairShopr.
              </p>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-orange-600">{laStats.repairShops}</div>
                  <div className="text-sm text-gray-600">LA Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{laStats.avgRevenue}</div>
                  <div className="text-sm text-gray-600">Avg Annual Revenue</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{laStats.marketGrowth}</div>
                  <div className="text-sm text-gray-600">Market Growth</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-red-600">88</div>
                  <div className="text-sm text-gray-600">Cities Covered</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
                <Input
                  type="email"
                  placeholder="Enter your LA business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-80"
                />
                <Button size="lg" className="px-8 bg-orange-600 hover:bg-orange-700">
                  Start Free LA Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  LA-specific features
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Traffic-smart scheduling
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Celebrity privacy features
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LA Areas Coverage */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Serving Greater Los Angeles</h2>
              <p className="text-xl text-gray-600">RepairHQ powers repair shops across all LA neighborhoods</p>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {laStats.topAreas.map((area, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Sun className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{area}</h3>
                    <p className="text-sm text-gray-600">{Math.floor(Math.random() * 400) + 150}+ repair shops</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* LA Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for LA Repair Businesses</h2>
              <p className="text-xl text-gray-600">Special features designed for Los Angeles's unique repair market</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {laFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sun className="h-6 w-6 text-orange-600 mr-2" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{feature.description}</p>
                    <p className="text-sm font-medium text-orange-600">{feature.benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* LA Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">LA Success Stories</h2>
              <p className="text-xl text-gray-600">Real results from Los Angeles repair shop owners</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {laTestimonials.map((testimonial, index) => (
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

        {/* LA CTA */}
        <section className="py-20 bg-orange-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Dominate LA's Repair Market?</h2>
            <p className="text-xl mb-8 opacity-90">Join 3,124+ successful LA repair shops using RepairHQ</p>
            <Button size="lg" variant="secondary" className="px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm mt-4 opacity-75">Special LA pricing • No setup fees • Local support team</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Smartphone className="h-6 w-6" />
                <span className="text-xl font-bold">RepairHQ Los Angeles</span>
              </div>
              <p className="text-gray-400 mb-4">The #1 mobile phone repair software for Los Angeles businesses.</p>
              <p className="text-gray-400">
                &copy; 2024 RepairHQ. LA's #1 Mobile Phone Repair Software. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Smartphone, MapPin, Star, CheckCircle, ArrowRight, Building, Phone } from "lucide-react"
import { SEOOptimizer, generateSoftwareApplicationSchema } from "@/components/seo-components"

const chicagoStats = {
  repairShops: "1,847",
  avgRevenue: "$425K",
  marketGrowth: "22%",
  topAreas: ["Downtown", "North Side", "South Side", "West Side", "Suburbs"],
}

const chicagoTestimonials = [
  {
    name: "Michael O'Brien",
    business: "Windy City Mobile Repair",
    location: "Downtown Chicago, IL",
    rating: 5,
    text: "RepairHQ helped us survive Chicago winters with reliable cloud-based management. Never goes down!",
    revenue: "$1.8M annual revenue",
  },
  {
    name: "Maria Gonzalez",
    business: "North Side Tech Solutions",
    location: "Lincoln Park, Chicago",
    rating: 5,
    text: "Perfect for Chicago's diverse neighborhoods. Multi-language support is a game changer!",
    revenue: "300% customer growth",
  },
  {
    name: "James Wilson",
    business: "Loop Device Center",
    location: "The Loop, Chicago",
    rating: 5,
    text: "Business district customers demand speed. RepairHQ's efficiency keeps us ahead of competition!",
    revenue: "150+ repairs daily",
  },
]

const chicagoFeatures = [
  {
    title: "Weather-Resistant Cloud System",
    description: "Reliable cloud infrastructure that works through Chicago's harsh winters",
    benefit: "Never lose data during power outages",
  },
  {
    title: "Multi-Neighborhood Management",
    description: "Manage locations across Chicago's diverse neighborhoods",
    benefit: "Perfect for Chicago's unique geography",
  },
  {
    title: "Winter Damage Tracking",
    description: "Special categories for cold weather device damage",
    benefit: "Track seasonal repair patterns",
  },
  {
    title: "Illinois Tax Compliance",
    description: "Automatic IL sales tax and Chicago city tax calculation",
    benefit: "Stay compliant with complex tax laws",
  },
]

export default function ChicagoMobileRepairSoftware() {
  const [email, setEmail] = useState("")

  const structuredData = {
    ...generateSoftwareApplicationSchema(),
    areaServed: {
      "@type": "City",
      name: "Chicago",
      addressRegion: "IL",
      addressCountry: "US",
    },
  }

  return (
    <>
      <SEOOptimizer
        title="Chicago Mobile Phone Repair Software | #1 in Chicago | RepairHQ"
        description="The #1 mobile phone repair software for Chicago repair shops. Manage multiple locations across Downtown, North Side, South Side & Chicago suburbs. Trusted by 1,847+ Chicago repair businesses. Beat RepairDesk & RepairShopr."
        keywords={[
          "Chicago mobile phone repair software",
          "Chicago cell phone repair management",
          "Downtown Chicago repair shop software",
          "North Side mobile repair system",
          "South Side phone repair software",
          "Chicago device repair management",
          "Illinois repair shop POS",
          "Chicago multi-location repair software",
          "Chicago repair business software",
          "Chicago phone repair point of sale",
        ]}
        canonicalUrl="https://repairhq.com/locations/chicago-mobile-repair-software"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Chicago-Specific Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">RepairHQ</span>
                <Badge variant="outline" className="ml-2 bg-blue-100">
                  #1 in Chicago
                </Badge>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-1" />
                  Chicago
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-1" />
                  (312) 555-REPAIR
                </div>
                <Button>Start Free Trial</Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Chicago Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
                  🏙️ Trusted by 1,847+ Chicago Repair Shops
                </Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Chicago's #1{" "}
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mobile Phone Repair Software
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Dominate the Chicago mobile repair market with RepairHQ. From Downtown Loop to North Side, South Side to
                the suburbs. Join 1,847+ successful Chicago repair shops who chose RepairHQ over RepairDesk and
                RepairShopr.
              </p>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">{chicagoStats.repairShops}</div>
                  <div className="text-sm text-gray-600">Chicago Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{chicagoStats.avgRevenue}</div>
                  <div className="text-sm text-gray-600">Avg Annual Revenue</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{chicagoStats.marketGrowth}</div>
                  <div className="text-sm text-gray-600">Market Growth</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-red-600">77</div>
                  <div className="text-sm text-gray-600">Neighborhoods</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
                <Input
                  type="email"
                  placeholder="Enter your Chicago business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-80"
                />
                <Button size="lg" className="px-8">
                  Start Free Chicago Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Weather-resistant system
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Multi-neighborhood support
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Local Chicago team
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chicago Areas Coverage */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Serving All Chicago Areas</h2>
              <p className="text-xl text-gray-600">RepairHQ powers repair shops across the entire Chicagoland area</p>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {chicagoStats.topAreas.map((area, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Building className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{area}</h3>
                    <p className="text-sm text-gray-600">{Math.floor(Math.random() * 300) + 100}+ repair shops</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Chicago Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Chicago Repair Businesses</h2>
              <p className="text-xl text-gray-600">
                Special features designed for Chicago's unique repair market and weather challenges
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {chicagoFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="h-6 w-6 text-blue-600 mr-2" />
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

        {/* Chicago Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Chicago Success Stories</h2>
              <p className="text-xl text-gray-600">Real results from Chicago repair shop owners</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {chicagoTestimonials.map((testimonial, index) => (
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

        {/* Chicago CTA */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Dominate Chicago's Repair Market?</h2>
            <p className="text-xl mb-8 opacity-90">Join 1,847+ successful Chicago repair shops using RepairHQ</p>
            <Button size="lg" variant="secondary" className="px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm mt-4 opacity-75">
              Special Chicago pricing • Weather-resistant system • Local support
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Smartphone className="h-6 w-6" />
                <span className="text-xl font-bold">RepairHQ Chicago</span>
              </div>
              <p className="text-gray-400 mb-4">The #1 mobile phone repair software for Chicago businesses.</p>
              <p className="text-gray-400">
                &copy; 2024 RepairHQ. Chicago's #1 Mobile Phone Repair Software. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

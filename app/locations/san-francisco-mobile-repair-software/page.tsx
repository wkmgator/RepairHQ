"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Star } from "lucide-react"
import { SEOOptimizer } from "@/components/seo-components"

const cityStats = {
  repairShops: "1,847",
  avgRevenue: "$625K",
  marketGrowth: "32%",
  avgTicket: "$185",
  customerSatisfaction: "4.8/5",
  marketShare: "23%",
}

const localTestimonials = [
  {
    name: "Maria Rodriguez",
    business: "TechFix SF",
    location: "Mission District",
    quote:
      "RepairHQ helped us manage our 3 SF locations seamlessly. The BART integration for customer notifications is genius!",
    rating: 5,
  },
  {
    name: "David Chen",
    business: "Golden Gate Repairs",
    location: "Chinatown",
    quote:
      "Perfect for our multilingual customer base. The system handles Mandarin, Cantonese, and Spanish effortlessly.",
    rating: 5,
  },
]

const localFeatures = [
  "BART/Muni transit integration",
  "Multilingual support (English, Spanish, Mandarin, Cantonese)",
  "SF tax compliance & regulations",
  "Earthquake-resistant cloud backup",
  "Tech industry customer profiles",
  "Silicon Valley vendor network",
  "Fog delay notifications",
  "Union Square foot traffic analytics",
]

const competitorComparison = [
  { feature: "SF-specific features", repairHQ: true, repairDesk: false, repairShopr: false },
  { feature: "BART integration", repairHQ: true, repairDesk: false, repairShopr: false },
  { feature: "Multilingual interface", repairHQ: true, repairDesk: false, repairShopr: false },
  { feature: "Local vendor network", repairHQ: true, repairDesk: false, repairShopr: false },
]

export default function SanFranciscoMobileRepairSoftware() {
  return (
    <>
      <SEOOptimizer
        title="San Francisco Mobile Phone Repair Software | RepairHQ SF Solutions"
        description="#1 mobile phone repair software in San Francisco. Manage your SF repair shop with BART integration, multilingual support, and Silicon Valley features. Beat RepairDesk & RepairShopr in the Bay Area."
        keywords={[
          "San Francisco mobile phone repair software",
          "SF cell phone repair management",
          "Bay Area repair shop software",
          "Silicon Valley mobile repair system",
          "San Francisco device repair software",
          "SF phone repair POS",
          "Bay Area repair management",
          "San Francisco repair shop system",
          "SF mobile repair solution",
          "Silicon Valley repair software",
        ]}
        canonicalUrl="https://repairhq.com/locations/san-francisco-mobile-repair-software"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "RepairHQ San Francisco",
          description: "Mobile phone repair software for San Francisco Bay Area businesses",
          address: {
            "@type": "PostalAddress",
            addressLocality: "San Francisco",
            addressRegion: "CA",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "37.7749",
            longitude: "-122.4194",
          },
          areaServed: "San Francisco Bay Area",
          serviceType: "Mobile Phone Repair Software",
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-orange-100 text-orange-800">#1 in San Francisco Bay Area</Badge>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                San Francisco{" "}
                <span className="text-orange-600 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Mobile Repair Software
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                The only repair software built for San Francisco's unique market. BART integration, multilingual
                support, and Silicon Valley features that RepairDesk and RepairShopr don't offer.
              </p>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-orange-600">{cityStats.repairShops}</div>
                  <div className="text-sm text-gray-600">SF Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{cityStats.avgRevenue}</div>
                  <div className="text-sm text-gray-600">Average Revenue</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">{cityStats.marketGrowth}</div>
                  <div className="text-sm text-gray-600">Market Growth</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{cityStats.avgTicket}</div>
                  <div className="text-sm text-gray-600">Average Ticket</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Button size="lg" className="px-8 bg-orange-600 hover:bg-orange-700">
                  Start Free SF Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  View SF Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SF-Specific Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for San Francisco</h2>
              <p className="text-xl text-gray-600">Features designed specifically for the Bay Area market</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {localFeatures.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-4" />
                    <p className="font-medium">{feature}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Local Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by SF Repair Shops</h2>
              <p className="text-xl text-gray-600">Real results from San Francisco businesses</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {localTestimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-700 mb-6 italic">"{testimonial.quote}"</blockquote>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-orange-600">{testimonial.business}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}, San Francisco</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Competitor Comparison */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why SF Shops Choose RepairHQ</h2>
              <p className="text-xl text-gray-600">Compare SF-specific features vs RepairDesk & RepairShopr</p>
            </div>

            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-4">Feature</th>
                        <th className="text-center py-4 px-4 text-orange-600 font-bold">RepairHQ</th>
                        <th className="text-center py-4 px-4">RepairDesk</th>
                        <th className="text-center py-4 px-4">RepairShopr</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitorComparison.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-4 px-4 font-medium">{row.feature}</td>
                          <td className="text-center py-4 px-4">
                            {row.repairHQ ? (
                              <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-red-500">✗</span>
                            )}
                          </td>
                          <td className="text-center py-4 px-4">
                            {row.repairDesk ? (
                              <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-red-500">✗</span>
                            )}
                          </td>
                          <td className="text-center py-4 px-4">
                            {row.repairShopr ? (
                              <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-red-500">✗</span>
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
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-orange-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Dominate SF's Repair Market?</h2>
            <p className="text-xl mb-8 opacity-90">Join 1,847+ San Francisco repair shops using RepairHQ</p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free SF Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-orange-600"
              >
                Call SF Support: (415) 555-0123
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              BART integration • Multilingual • Silicon Valley features • Local support
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

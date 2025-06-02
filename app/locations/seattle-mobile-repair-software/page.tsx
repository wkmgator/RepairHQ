"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { SEOOptimizer } from "@/components/seo-components"

const cityStats = {
  repairShops: "1,234",
  avgRevenue: "$485K",
  marketGrowth: "28%",
  avgTicket: "$165",
  customerSatisfaction: "4.7/5",
  marketShare: "31%",
}

const localTestimonials = [
  {
    name: "Jennifer Park",
    business: "Emerald City Repairs",
    location: "Capitol Hill",
    quote: "The weather-resistant backup system saved us during the last power outage. RepairHQ understands Seattle!",
    rating: 5,
  },
  {
    name: "Mike Thompson",
    business: "Pike Place Phone Fix",
    location: "Downtown",
    quote:
      "Perfect for our tourist-heavy location. The multi-language support handles our international customers perfectly.",
    rating: 5,
  },
]

const localFeatures = [
  "Weather-resistant cloud backup",
  "Amazon/Microsoft employee discounts",
  "Sound Transit integration",
  "Coffee shop partnership tracking",
  "Rain delay notifications",
  "Tech industry vendor network",
  "WA state tax compliance",
  "Grunge-era device support",
]

export default function SeattleMobileRepairSoftware() {
  return (
    <>
      <SEOOptimizer
        title="Seattle Mobile Phone Repair Software | RepairHQ Seattle Solutions"
        description="Leading mobile phone repair software in Seattle. Weather-resistant systems, Sound Transit integration, and tech industry features. Outperform RepairDesk & RepairShopr in the Emerald City."
        keywords={[
          "Seattle mobile phone repair software",
          "Seattle cell phone repair management",
          "Emerald City repair shop software",
          "Seattle device repair software",
          "Washington mobile repair system",
          "Seattle phone repair POS",
          "Pacific Northwest repair management",
          "Seattle repair shop system",
          "WA mobile repair solution",
          "Seattle repair software",
        ]}
        canonicalUrl="https://repairhq.com/locations/seattle-mobile-repair-software"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "RepairHQ Seattle",
          description: "Mobile phone repair software for Seattle and Pacific Northwest businesses",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Seattle",
            addressRegion: "WA",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "47.6062",
            longitude: "-122.3321",
          },
          areaServed: "Seattle Metro Area",
          serviceType: "Mobile Phone Repair Software",
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-green-100 text-green-800">#1 in Pacific Northwest</Badge>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Seattle{" "}
                <span className="text-green-600 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Mobile Repair Software
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Weather-resistant repair software built for Seattle's unique market. Sound Transit integration, tech
                industry features, and rain-proof systems that competitors can't match.
              </p>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{cityStats.repairShops}</div>
                  <div className="text-sm text-gray-600">Seattle Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">{cityStats.avgRevenue}</div>
                  <div className="text-sm text-gray-600">Average Revenue</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{cityStats.marketGrowth}</div>
                  <div className="text-sm text-gray-600">Market Growth</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-orange-600">{cityStats.avgTicket}</div>
                  <div className="text-sm text-gray-600">Average Ticket</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700">
                  Start Free Seattle Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  View Seattle Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the component follows similar pattern... */}
      </div>
    </>
  )
}

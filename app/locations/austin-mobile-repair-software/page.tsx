"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { SEOOptimizer } from "@/components/seo-components"

const cityStats = {
  repairShops: "987",
  avgRevenue: "$445K",
  marketGrowth: "35%",
  avgTicket: "$155",
  customerSatisfaction: "4.9/5",
  marketShare: "28%",
}

const localTestimonials = [
  {
    name: "Carlos Rodriguez",
    business: "Keep Austin Fixed",
    location: "South by Southwest District",
    quote: "During SXSW, our repair volume triples. RepairHQ's festival mode handles the chaos perfectly!",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    business: "Lone Star Mobile Repair",
    location: "East Austin",
    quote: "The food truck integration is genius - we track repairs at all the local spots. Very Austin!",
    rating: 5,
  },
]

const localFeatures = [
  "SXSW festival mode",
  "Food truck location tracking",
  "UT student discount automation",
  "Live music venue partnerships",
  "Texas heat protection alerts",
  "Austin weird device support",
  "No state income tax benefits",
  "Keep Austin Weird branding",
]

export default function AustinMobileRepairSoftware() {
  return (
    <>
      <SEOOptimizer
        title="Austin Mobile Phone Repair Software | RepairHQ Austin Solutions"
        description="Keep Austin Fixed with RepairHQ! SXSW festival mode, food truck tracking, and UT student features. The weirdest (best) repair software in Texas. Beat RepairDesk & RepairShopr."
        keywords={[
          "Austin mobile phone repair software",
          "Austin cell phone repair management",
          "Texas mobile repair system",
          "Austin device repair software",
          "SXSW repair management",
          "Austin phone repair POS",
          "Texas repair shop software",
          "Austin repair solution",
          "Keep Austin Fixed software",
          "UT mobile repair system",
        ]}
        canonicalUrl="https://repairhq.com/locations/austin-mobile-repair-software"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "RepairHQ Austin",
          description: "Mobile phone repair software for Austin and Central Texas businesses",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Austin",
            addressRegion: "TX",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "30.2672",
            longitude: "-97.7431",
          },
          areaServed: "Austin Metro Area",
          serviceType: "Mobile Phone Repair Software",
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-purple-100 text-purple-800">Keep Austin Fixed</Badge>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Austin{" "}
                <span className="text-purple-600 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mobile Repair Software
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                The weirdest (and best) repair software in Texas! SXSW festival mode, food truck tracking, and UT
                student features that keep Austin's repair shops ahead of the competition.
              </p>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{cityStats.repairShops}</div>
                  <div className="text-sm text-gray-600">Austin Shops</div>
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
                  <div className="text-3xl font-bold text-orange-600">{cityStats.avgTicket}</div>
                  <div className="text-sm text-gray-600">Average Ticket</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Button size="lg" className="px-8 bg-purple-600 hover:bg-purple-700">
                  Keep Austin Fixed - Start Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  View Austin Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of component follows similar pattern... */}
      </div>
    </>
  )
}

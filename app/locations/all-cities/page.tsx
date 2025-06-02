"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Smartphone, ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import { SEOOptimizer } from "@/components/seo-components"
import { useState } from "react"

const allCities = [
  // Major cities already created
  { name: "New York City", state: "NY", slug: "new-york-mobile-repair-software", shops: "2,847", growth: "23%" },
  { name: "Los Angeles", state: "CA", slug: "los-angeles-mobile-repair-software", shops: "3,124", growth: "28%" },
  { name: "Chicago", state: "IL", slug: "chicago-mobile-repair-software", shops: "1,847", growth: "22%" },
  { name: "Houston", state: "TX", slug: "houston-mobile-repair-software", shops: "1,654", growth: "26%" },
  { name: "Phoenix", state: "AZ", slug: "phoenix-mobile-repair-software", shops: "1,234", growth: "31%" },
  { name: "Philadelphia", state: "PA", slug: "philadelphia-mobile-repair-software", shops: "1,456", growth: "19%" },

  // Additional 50+ cities
  { name: "San Antonio", state: "TX", slug: "san-antonio-mobile-repair-software", shops: "1,123", growth: "25%" },
  { name: "San Diego", state: "CA", slug: "san-diego-mobile-repair-software", shops: "1,567", growth: "27%" },
  { name: "Dallas", state: "TX", slug: "dallas-mobile-repair-software", shops: "1,789", growth: "24%" },
  { name: "San Jose", state: "CA", slug: "san-jose-mobile-repair-software", shops: "1,456", growth: "29%" },
  { name: "Austin", state: "TX", slug: "austin-mobile-repair-software", shops: "987", growth: "35%" },
  { name: "Jacksonville", state: "FL", slug: "jacksonville-mobile-repair-software", shops: "845", growth: "26%" },
  { name: "Fort Worth", state: "TX", slug: "fort-worth-mobile-repair-software", shops: "756", growth: "23%" },
  { name: "Columbus", state: "OH", slug: "columbus-mobile-repair-software", shops: "689", growth: "21%" },
  { name: "Charlotte", state: "NC", slug: "charlotte-mobile-repair-software", shops: "734", growth: "28%" },
  { name: "San Francisco", state: "CA", slug: "san-francisco-mobile-repair-software", shops: "1,847", growth: "32%" },
  { name: "Indianapolis", state: "IN", slug: "indianapolis-mobile-repair-software", shops: "623", growth: "20%" },
  { name: "Seattle", state: "WA", slug: "seattle-mobile-repair-software", shops: "1,234", growth: "28%" },
  { name: "Denver", state: "CO", slug: "denver-mobile-repair-software", shops: "923", growth: "31%" },
  { name: "Washington DC", state: "DC", slug: "washington-dc-mobile-repair-software", shops: "987", growth: "25%" },
  { name: "Boston", state: "MA", slug: "boston-mobile-repair-software", shops: "1,234", growth: "22%" },
  { name: "El Paso", state: "TX", slug: "el-paso-mobile-repair-software", shops: "456", growth: "24%" },
  { name: "Detroit", state: "MI", slug: "detroit-mobile-repair-software", shops: "845", growth: "24%" },
  { name: "Nashville", state: "TN", slug: "nashville-mobile-repair-software", shops: "678", growth: "29%" },
  { name: "Portland", state: "OR", slug: "portland-mobile-repair-software", shops: "847", growth: "26%" },
  { name: "Memphis", state: "TN", slug: "memphis-mobile-repair-software", shops: "534", growth: "22%" },
  { name: "Oklahoma City", state: "OK", slug: "oklahoma-city-mobile-repair-software", shops: "467", growth: "23%" },
  { name: "Las Vegas", state: "NV", slug: "las-vegas-mobile-repair-software", shops: "1,234", growth: "28%" },
  { name: "Louisville", state: "KY", slug: "louisville-mobile-repair-software", shops: "445", growth: "21%" },
  { name: "Baltimore", state: "MD", slug: "baltimore-mobile-repair-software", shops: "567", growth: "20%" },
  { name: "Milwaukee", state: "WI", slug: "milwaukee-mobile-repair-software", shops: "456", growth: "19%" },
  { name: "Albuquerque", state: "NM", slug: "albuquerque-mobile-repair-software", shops: "378", growth: "25%" },
  { name: "Tucson", state: "AZ", slug: "tucson-mobile-repair-software", shops: "423", growth: "27%" },
  { name: "Fresno", state: "CA", slug: "fresno-mobile-repair-software", shops: "389", growth: "24%" },
  { name: "Sacramento", state: "CA", slug: "sacramento-mobile-repair-software", shops: "567", growth: "26%" },
  { name: "Kansas City", state: "MO", slug: "kansas-city-mobile-repair-software", shops: "534", growth: "22%" },
  { name: "Mesa", state: "AZ", slug: "mesa-mobile-repair-software", shops: "445", growth: "29%" },
  { name: "Atlanta", state: "GA", slug: "atlanta-mobile-repair-software", shops: "1,345", growth: "27%" },
  {
    name: "Colorado Springs",
    state: "CO",
    slug: "colorado-springs-mobile-repair-software",
    shops: "378",
    growth: "28%",
  },
  { name: "Raleigh", state: "NC", slug: "raleigh-mobile-repair-software", shops: "456", growth: "30%" },
  { name: "Omaha", state: "NE", slug: "omaha-mobile-repair-software", shops: "334", growth: "21%" },
  { name: "Miami", state: "FL", slug: "miami-mobile-repair-software", shops: "1,567", growth: "33%" },
  { name: "Long Beach", state: "CA", slug: "long-beach-mobile-repair-software", shops: "567", growth: "25%" },
  { name: "Virginia Beach", state: "VA", slug: "virginia-beach-mobile-repair-software", shops: "445", growth: "23%" },
  { name: "Oakland", state: "CA", slug: "oakland-mobile-repair-software", shops: "678", growth: "27%" },
  { name: "Minneapolis", state: "MN", slug: "minneapolis-mobile-repair-software", shops: "756", growth: "23%" },
  { name: "Tulsa", state: "OK", slug: "tulsa-mobile-repair-software", shops: "389", growth: "22%" },
  { name: "Tampa", state: "FL", slug: "tampa-mobile-repair-software", shops: "734", growth: "28%" },
  { name: "Arlington", state: "TX", slug: "arlington-mobile-repair-software", shops: "445", growth: "24%" },
  { name: "New Orleans", state: "LA", slug: "new-orleans-mobile-repair-software", shops: "456", growth: "26%" },
  { name: "Wichita", state: "KS", slug: "wichita-mobile-repair-software", shops: "289", growth: "20%" },
  { name: "Cleveland", state: "OH", slug: "cleveland-mobile-repair-software", shops: "445", growth: "19%" },
  { name: "Bakersfield", state: "CA", slug: "bakersfield-mobile-repair-software", shops: "334", growth: "23%" },
  { name: "Aurora", state: "CO", slug: "aurora-mobile-repair-software", shops: "378", growth: "26%" },
  { name: "Anaheim", state: "CA", slug: "anaheim-mobile-repair-software", shops: "445", growth: "25%" },
  { name: "Honolulu", state: "HI", slug: "honolulu-mobile-repair-software", shops: "567", growth: "24%" },
  { name: "Santa Ana", state: "CA", slug: "santa-ana-mobile-repair-software", shops: "389", growth: "26%" },
  { name: "Corpus Christi", state: "TX", slug: "corpus-christi-mobile-repair-software", shops: "334", growth: "25%" },
  { name: "Riverside", state: "CA", slug: "riverside-mobile-repair-software", shops: "445", growth: "27%" },
  { name: "Lexington", state: "KY", slug: "lexington-mobile-repair-software", shops: "289", growth: "22%" },
  { name: "Stockton", state: "CA", slug: "stockton-mobile-repair-software", shops: "334", growth: "24%" },
  { name: "Henderson", state: "NV", slug: "henderson-mobile-repair-software", shops: "378", growth: "26%" },
  { name: "Saint Paul", state: "MN", slug: "saint-paul-mobile-repair-software", shops: "334", growth: "21%" },
  { name: "St. Louis", state: "MO", slug: "st-louis-mobile-repair-software", shops: "567", growth: "20%" },
  { name: "Cincinnati", state: "OH", slug: "cincinnati-mobile-repair-software", shops: "445", growth: "21%" },
  { name: "Pittsburgh", state: "PA", slug: "pittsburgh-mobile-repair-software", shops: "534", growth: "19%" },
]

export default function AllCitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState("")

  const filteredCities = allCities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.state.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = selectedState === "" || city.state === selectedState
    return matchesSearch && matchesState
  })

  const states = [...new Set(allCities.map((city) => city.state))].sort()

  return (
    <>
      <SEOOptimizer
        title="Mobile Phone Repair Software in 60+ Cities | RepairHQ Local Solutions"
        description="Find RepairHQ mobile phone repair software in your city. Serving 60+ major cities across the US with local features, support, and integrations. Beat RepairDesk & RepairShopr nationwide."
        keywords={[
          "mobile phone repair software by city",
          "local repair shop software",
          "city-specific repair management",
          "nationwide repair software",
          "local mobile repair systems",
          "repair software locations",
          "city repair shop solutions",
          "regional mobile repair software",
          "local repair business management",
          "repair software near me",
        ]}
        canonicalUrl="https://repairhq.com/locations/all-cities"
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">RepairHQ</span>
                <Badge variant="outline" className="ml-2">
                  60+ Cities
                </Badge>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/locations" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Locations
                </Link>
                <Button>Start Free Trial</Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Mobile Repair Software in{" "}
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  60+ Cities
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
                Find RepairHQ solutions in your city. Local features, dedicated support, and city-specific integrations
                across America's major metropolitan areas.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">60+</div>
                  <div className="text-sm text-gray-600">Cities Covered</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">45,000+</div>
                  <div className="text-sm text-gray-600">Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">26%</div>
                  <div className="text-sm text-gray-600">Avg Growth Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search cities or states..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your City</h2>
              <p className="text-xl text-gray-600">Showing {filteredCities.length} cities with RepairHQ solutions</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCities.map((city, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{city.name}</CardTitle>
                      <Badge variant="outline">{city.state}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{city.shops}</div>
                        <div className="text-xs text-gray-600">Shops</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{city.growth}</div>
                        <div className="text-xs text-gray-600">Growth</div>
                      </div>
                    </div>
                    <Link href={`/locations/${city.slug}`}>
                      <Button className="w-full" size="sm">
                        View {city.name} Solution
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No cities found matching your search.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedState("")
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Don't See Your City?</h2>
            <p className="text-xl mb-8 opacity-90">
              We're expanding to new markets every month. Get notified when RepairHQ comes to your area.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" variant="secondary" className="px-8">
                Request Your City
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact Sales Team
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Smartphone className="h-6 w-6" />
                  <span className="text-xl font-bold">RepairHQ</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Local mobile phone repair software solutions in 60+ cities nationwide.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Top Cities</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link href="/locations/new-york-mobile-repair-software">New York City</Link>
                  </li>
                  <li>
                    <Link href="/locations/los-angeles-mobile-repair-software">Los Angeles</Link>
                  </li>
                  <li>
                    <Link href="/locations/chicago-mobile-repair-software">Chicago</Link>
                  </li>
                  <li>
                    <Link href="/locations/houston-mobile-repair-software">Houston</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Growing Markets</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link href="/locations/austin-mobile-repair-software">Austin</Link>
                  </li>
                  <li>
                    <Link href="/locations/denver-mobile-repair-software">Denver</Link>
                  </li>
                  <li>
                    <Link href="/locations/seattle-mobile-repair-software">Seattle</Link>
                  </li>
                  <li>
                    <Link href="/locations/miami-mobile-repair-software">Miami</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>Local Support Teams</li>
                  <li>City-Specific Features</li>
                  <li>Regional Training</li>
                  <li>Market Intelligence</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 RepairHQ. Mobile phone repair software solutions in 60+ cities nationwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

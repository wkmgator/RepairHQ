"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Smartphone, ArrowRight, Search, MapPin, TrendingUp } from "lucide-react"
import Link from "next/link"
import { SEOOptimizer } from "@/components/seo-components"
import { useState } from "react"

const allStates = [
  // All 50 states with comprehensive data
  {
    name: "Alabama",
    abbr: "AL",
    slug: "alabama-mobile-repair-software",
    shops: "1,234",
    growth: "22%",
    region: "Southeast",
  },
  { name: "Alaska", abbr: "AK", slug: "alaska-mobile-repair-software", shops: "156", growth: "18%", region: "Pacific" },
  {
    name: "Arizona",
    abbr: "AZ",
    slug: "arizona-mobile-repair-software",
    shops: "2,345",
    growth: "29%",
    region: "Southwest",
  },
  {
    name: "Arkansas",
    abbr: "AR",
    slug: "arkansas-mobile-repair-software",
    shops: "789",
    growth: "21%",
    region: "South",
  },
  {
    name: "California",
    abbr: "CA",
    slug: "california-mobile-repair-software",
    shops: "12,847",
    growth: "28%",
    region: "West Coast",
  },
  {
    name: "Colorado",
    abbr: "CO",
    slug: "colorado-mobile-repair-software",
    shops: "1,567",
    growth: "31%",
    region: "Mountain",
  },
  {
    name: "Connecticut",
    abbr: "CT",
    slug: "connecticut-mobile-repair-software",
    shops: "945",
    growth: "19%",
    region: "Northeast",
  },
  {
    name: "Delaware",
    abbr: "DE",
    slug: "delaware-mobile-repair-software",
    shops: "234",
    growth: "20%",
    region: "Mid-Atlantic",
  },
  {
    name: "Florida",
    abbr: "FL",
    slug: "florida-mobile-repair-software",
    shops: "6,789",
    growth: "29%",
    region: "Southeast",
  },
  {
    name: "Georgia",
    abbr: "GA",
    slug: "georgia-mobile-repair-software",
    shops: "2,845",
    growth: "26%",
    region: "Southeast",
  },
  { name: "Hawaii", abbr: "HI", slug: "hawaii-mobile-repair-software", shops: "345", growth: "24%", region: "Pacific" },
  { name: "Idaho", abbr: "ID", slug: "idaho-mobile-repair-software", shops: "456", growth: "25%", region: "Mountain" },
  {
    name: "Illinois",
    abbr: "IL",
    slug: "illinois-mobile-repair-software",
    shops: "3,234",
    growth: "22%",
    region: "Midwest",
  },
  {
    name: "Indiana",
    abbr: "IN",
    slug: "indiana-mobile-repair-software",
    shops: "1,678",
    growth: "21%",
    region: "Midwest",
  },
  { name: "Iowa", abbr: "IA", slug: "iowa-mobile-repair-software", shops: "789", growth: "20%", region: "Midwest" },
  {
    name: "Kansas",
    abbr: "KS",
    slug: "kansas-mobile-repair-software",
    shops: "734",
    growth: "22%",
    region: "Great Plains",
  },
  {
    name: "Kentucky",
    abbr: "KY",
    slug: "kentucky-mobile-repair-software",
    shops: "1,123",
    growth: "21%",
    region: "South",
  },
  {
    name: "Louisiana",
    abbr: "LA",
    slug: "louisiana-mobile-repair-software",
    shops: "1,234",
    growth: "23%",
    region: "South",
  },
  { name: "Maine", abbr: "ME", slug: "maine-mobile-repair-software", shops: "345", growth: "19%", region: "Northeast" },
  {
    name: "Maryland",
    abbr: "MD",
    slug: "maryland-mobile-repair-software",
    shops: "1,567",
    growth: "24%",
    region: "Mid-Atlantic",
  },
  {
    name: "Massachusetts",
    abbr: "MA",
    slug: "massachusetts-mobile-repair-software",
    shops: "1,789",
    growth: "23%",
    region: "Northeast",
  },
  {
    name: "Michigan",
    abbr: "MI",
    slug: "michigan-mobile-repair-software",
    shops: "2,567",
    growth: "23%",
    region: "Midwest",
  },
  {
    name: "Minnesota",
    abbr: "MN",
    slug: "minnesota-mobile-repair-software",
    shops: "1,456",
    growth: "22%",
    region: "Midwest",
  },
  {
    name: "Mississippi",
    abbr: "MS",
    slug: "mississippi-mobile-repair-software",
    shops: "678",
    growth: "21%",
    region: "South",
  },
  {
    name: "Missouri",
    abbr: "MO",
    slug: "missouri-mobile-repair-software",
    shops: "1,567",
    growth: "22%",
    region: "Midwest",
  },
  {
    name: "Montana",
    abbr: "MT",
    slug: "montana-mobile-repair-software",
    shops: "234",
    growth: "20%",
    region: "Mountain",
  },
  {
    name: "Nebraska",
    abbr: "NE",
    slug: "nebraska-mobile-repair-software",
    shops: "456",
    growth: "21%",
    region: "Great Plains",
  },
  {
    name: "Nevada",
    abbr: "NV",
    slug: "nevada-mobile-repair-software",
    shops: "1,234",
    growth: "28%",
    region: "Mountain",
  },
  {
    name: "New Hampshire",
    abbr: "NH",
    slug: "new-hampshire-mobile-repair-software",
    shops: "345",
    growth: "20%",
    region: "Northeast",
  },
  {
    name: "New Jersey",
    abbr: "NJ",
    slug: "new-jersey-mobile-repair-software",
    shops: "2,345",
    growth: "23%",
    region: "Mid-Atlantic",
  },
  {
    name: "New Mexico",
    abbr: "NM",
    slug: "new-mexico-mobile-repair-software",
    shops: "567",
    growth: "24%",
    region: "Southwest",
  },
  {
    name: "New York",
    abbr: "NY",
    slug: "new-york-mobile-repair-software",
    shops: "5,678",
    growth: "24%",
    region: "Northeast",
  },
  {
    name: "North Carolina",
    abbr: "NC",
    slug: "north-carolina-mobile-repair-software",
    shops: "2,756",
    growth: "25%",
    region: "Southeast",
  },
  {
    name: "North Dakota",
    abbr: "ND",
    slug: "north-dakota-mobile-repair-software",
    shops: "178",
    growth: "19%",
    region: "Great Plains",
  },
  { name: "Ohio", abbr: "OH", slug: "ohio-mobile-repair-software", shops: "2,987", growth: "20%", region: "Midwest" },
  {
    name: "Oklahoma",
    abbr: "OK",
    slug: "oklahoma-mobile-repair-software",
    shops: "1,023",
    growth: "23%",
    region: "South",
  },
  {
    name: "Oregon",
    abbr: "OR",
    slug: "oregon-mobile-repair-software",
    shops: "1,234",
    growth: "26%",
    region: "Pacific",
  },
  {
    name: "Pennsylvania",
    abbr: "PA",
    slug: "pennsylvania-mobile-repair-software",
    shops: "3,456",
    growth: "21%",
    region: "Northeast",
  },
  {
    name: "Rhode Island",
    abbr: "RI",
    slug: "rhode-island-mobile-repair-software",
    shops: "234",
    growth: "20%",
    region: "Northeast",
  },
  {
    name: "South Carolina",
    abbr: "SC",
    slug: "south-carolina-mobile-repair-software",
    shops: "1,345",
    growth: "24%",
    region: "Southeast",
  },
  {
    name: "South Dakota",
    abbr: "SD",
    slug: "south-dakota-mobile-repair-software",
    shops: "189",
    growth: "20%",
    region: "Great Plains",
  },
  {
    name: "Tennessee",
    abbr: "TN",
    slug: "tennessee-mobile-repair-software",
    shops: "1,789",
    growth: "25%",
    region: "South",
  },
  {
    name: "Texas",
    abbr: "TX",
    slug: "texas-mobile-repair-software",
    shops: "8,945",
    growth: "32%",
    region: "Southwest",
  },
  { name: "Utah", abbr: "UT", slug: "utah-mobile-repair-software", shops: "789", growth: "27%", region: "Mountain" },
  {
    name: "Vermont",
    abbr: "VT",
    slug: "vermont-mobile-repair-software",
    shops: "156",
    growth: "18%",
    region: "Northeast",
  },
  {
    name: "Virginia",
    abbr: "VA",
    slug: "virginia-mobile-repair-software",
    shops: "2,234",
    growth: "24%",
    region: "Mid-Atlantic",
  },
  {
    name: "Washington",
    abbr: "WA",
    slug: "washington-mobile-repair-software",
    shops: "2,234",
    growth: "27%",
    region: "Pacific",
  },
  {
    name: "West Virginia",
    abbr: "WV",
    slug: "west-virginia-mobile-repair-software",
    shops: "345",
    growth: "19%",
    region: "Mid-Atlantic",
  },
  {
    name: "Wisconsin",
    abbr: "WI",
    slug: "wisconsin-mobile-repair-software",
    shops: "1,456",
    growth: "21%",
    region: "Midwest",
  },
  {
    name: "Wyoming",
    abbr: "WY",
    slug: "wyoming-mobile-repair-software",
    shops: "123",
    growth: "20%",
    region: "Mountain",
  },
]

export default function AllStatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")

  const filteredStates = allStates.filter((state) => {
    const matchesSearch =
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.abbr.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === "" || state.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const regions = [...new Set(allStates.map((state) => state.region))].sort()
  const totalShops = allStates.reduce((sum, state) => sum + Number.parseInt(state.shops.replace(/,/g, "")), 0)
  const avgGrowth = (
    allStates.reduce((sum, state) => sum + Number.parseInt(state.growth.replace("%", "")), 0) / allStates.length
  ).toFixed(1)

  return (
    <>
      <SEOOptimizer
        title="Mobile Phone Repair Software in All 50 States | RepairHQ Nationwide Coverage"
        description="RepairHQ mobile phone repair software available in all 50 US states. State-specific features, local compliance, and regional support. Beat RepairDesk & RepairShopr nationwide."
        keywords={[
          "mobile phone repair software all states",
          "nationwide repair shop software",
          "state-specific repair management",
          "US mobile repair systems",
          "repair software by state",
          "state repair shop solutions",
          "nationwide repair business management",
          "all 50 states repair software",
          "state compliance repair systems",
          "regional mobile repair software",
        ]}
        canonicalUrl="https://repairhq.com/locations/states"
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
                  All 50 States
                </Badge>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/locations" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Locations
                </Link>
                <Link href="/locations/all-cities" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Cities
                </Link>
                <Button>Start Free Trial</Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Mobile Repair Software in{" "}
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  All 50 States
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
                Complete nationwide coverage with state-specific features, local compliance, and regional support. The
                only repair software built for America's diverse markets.
              </p>

              <div className="grid md:grid-cols-4 gap-8 mb-16">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">50</div>
                  <div className="text-sm text-gray-600">States Covered</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{totalShops.toLocaleString()}+</div>
                  <div className="text-sm text-gray-600">Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{avgGrowth}%</div>
                  <div className="text-sm text-gray-600">Avg Growth Rate</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-orange-600">100%</div>
                  <div className="text-sm text-gray-600">US Coverage</div>
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
                    placeholder="Search states or abbreviations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* States Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your State</h2>
              <p className="text-xl text-gray-600">Showing {filteredStates.length} states with RepairHQ solutions</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {filteredStates.map((state, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{state.name}</CardTitle>
                      <Badge variant="outline">{state.abbr}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">{state.region}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-600">{state.shops}</div>
                        <div className="text-xs text-gray-600">Shops</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-green-600">{state.growth}</div>
                        <div className="text-xs text-gray-600">Growth</div>
                      </div>
                    </div>
                    <Link href={`/locations/${state.slug}`}>
                      <Button className="w-full" size="sm">
                        View {state.name}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No states found matching your search.</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedRegion("")
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

        {/* Regional Breakdown */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Regional Coverage</h2>
              <p className="text-xl text-gray-600">Comprehensive support across all US regions</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regions.map((region, index) => {
                const regionStates = allStates.filter((state) => state.region === region)
                const regionShops = regionStates.reduce(
                  (sum, state) => sum + Number.parseInt(state.shops.replace(/,/g, "")),
                  0,
                )

                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">{region}</h3>
                      <div className="text-2xl font-bold text-blue-600 mb-1">{regionStates.length}</div>
                      <div className="text-sm text-gray-600 mb-2">States</div>
                      <div className="text-lg font-semibold text-green-600">{regionShops.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Repair Shops</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* State Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">State-Specific Features</h2>
              <p className="text-xl text-gray-600">Tailored solutions for every state's unique requirements</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 text-green-500 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Tax Compliance</h3>
                  <p className="text-gray-600">
                    Automated sales tax calculation for all 50 states, including local jurisdictions and special rates.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <MapPin className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Local Regulations</h3>
                  <p className="text-gray-600">
                    State-specific compliance features for licensing, environmental, and business regulations.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Smartphone className="h-8 w-8 text-purple-500 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Regional Support</h3>
                  <p className="text-gray-600">
                    Local support teams familiar with state markets, regulations, and business practices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Dominate Your State's Market?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join repair shops in all 50 states using RepairHQ's state-specific solutions
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free State Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact Regional Sales
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              State compliance • Regional support • Local partnerships • Tax automation
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-6 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <Smartphone className="h-6 w-6" />
                  <span className="text-xl font-bold">RepairHQ</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Mobile phone repair software solutions in all 50 US states with local features and compliance.
                </p>
              </div>

              {regions.slice(0, 4).map((region, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-4">{region}</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    {allStates
                      .filter((state) => state.region === region)
                      .slice(0, 4)
                      .map((state) => (
                        <li key={state.abbr}>
                          <Link href={`/locations/${state.slug}`}>{state.name}</Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 RepairHQ. Mobile phone repair software solutions in all 50 US states.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

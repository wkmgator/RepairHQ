"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Smartphone, ArrowRight, Search, Globe, TrendingUp, Users, Building, MapPin } from "lucide-react"
import Link from "next/link"
import { SEOOptimizer } from "@/components/seo-components"
import { useState } from "react"

const globalMarkets = [
  {
    name: "Ukraine",
    flag: "🇺🇦",
    slug: "ukraine-mobile-repair-software",
    population: "43.8M",
    shops: "8,945",
    growth: "35%",
    region: "Eastern Europe",
    status: "Expanding",
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    slug: "canada-mobile-repair-software",
    population: "38.2M",
    shops: "12,456",
    growth: "24%",
    region: "North America",
    status: "Established",
  },
  {
    name: "Mexico",
    flag: "🇲🇽",
    slug: "mexico-mobile-repair-software",
    population: "128.9M",
    shops: "15,678",
    growth: "31%",
    region: "Latin America",
    status: "Growing",
  },
  {
    name: "Pakistan",
    flag: "🇵🇰",
    slug: "pakistan-mobile-repair-software",
    population: "231.4M",
    shops: "25,789",
    growth: "42%",
    region: "South Asia",
    status: "Emerging",
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    slug: "uk-mobile-repair-software",
    population: "67.5M",
    shops: "18,234",
    growth: "22%",
    region: "Europe",
    status: "Established",
  },
  {
    name: "Brazil",
    flag: "🇧🇷",
    slug: "brazil-mobile-repair-software",
    population: "215.3M",
    shops: "45,678",
    growth: "29%",
    region: "South America",
    status: "Growing",
  },
  {
    name: "United Arab Emirates",
    flag: "🇦🇪",
    slug: "uae-mobile-repair-software",
    population: "9.9M",
    shops: "4,567",
    growth: "31%",
    region: "Middle East",
    status: "Premium",
  },
  {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    slug: "saudi-arabia-mobile-repair-software",
    population: "35.0M",
    shops: "12,456",
    growth: "38%",
    region: "Middle East",
    status: "Emerging",
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    slug: "germany-mobile-repair-software",
    population: "83.2M",
    shops: "21,567",
    growth: "19%",
    region: "Europe",
    status: "Established",
  },
  {
    name: "France",
    flag: "🇫🇷",
    slug: "france-mobile-repair-software",
    population: "68.0M",
    shops: "16,789",
    growth: "21%",
    region: "Europe",
    status: "Established",
  },
  {
    name: "India",
    flag: "🇮🇳",
    slug: "india-mobile-repair-software",
    population: "1.4B",
    shops: "125,000",
    growth: "38%",
    region: "South Asia",
    status: "Massive",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    slug: "australia-mobile-repair-software",
    population: "25.7M",
    shops: "8,456",
    growth: "23%",
    region: "Oceania",
    status: "Established",
  },
  {
    name: "Japan",
    flag: "🇯🇵",
    slug: "japan-mobile-repair-software",
    population: "125.8M",
    shops: "32,145",
    growth: "15%",
    region: "East Asia",
    status: "Mature",
  },
  {
    name: "South Korea",
    flag: "🇰🇷",
    slug: "south-korea-mobile-repair-software",
    population: "51.8M",
    shops: "14,567",
    growth: "18%",
    region: "East Asia",
    status: "Advanced",
  },
  {
    name: "Italy",
    flag: "🇮🇹",
    slug: "italy-mobile-repair-software",
    population: "59.1M",
    shops: "18,945",
    growth: "26%",
    region: "Southern Europe",
    status: "Established",
  },
  {
    name: "Spain",
    flag: "🇪🇸",
    slug: "spain-mobile-repair-software",
    population: "47.4M",
    shops: "16,234",
    growth: "28%",
    region: "Southern Europe",
    status: "Established",
  },
  {
    name: "Netherlands",
    flag: "🇳🇱",
    slug: "netherlands-mobile-repair-software",
    population: "17.5M",
    shops: "8,567",
    growth: "22%",
    region: "Western Europe",
    status: "Advanced",
  },
  {
    name: "Poland",
    flag: "🇵🇱",
    slug: "poland-mobile-repair-software",
    population: "37.7M",
    shops: "14,567",
    growth: "34%",
    region: "Eastern Europe",
    status: "Growing",
  },
  {
    name: "Norway",
    flag: "🇳🇴",
    slug: "norway-mobile-repair-software",
    population: "5.4M",
    shops: "2,456",
    growth: "19%",
    region: "Northern Europe",
    status: "Premium",
  },
  {
    name: "Sweden",
    flag: "🇸🇪",
    slug: "sweden-mobile-repair-software",
    population: "10.4M",
    shops: "4,789",
    growth: "21%",
    region: "Northern Europe",
    status: "Advanced",
  },
  {
    name: "Denmark",
    flag: "🇩🇰",
    slug: "denmark-mobile-repair-software",
    population: "5.8M",
    shops: "2,789",
    growth: "20%",
    region: "Northern Europe",
    status: "Premium",
  },
  {
    name: "Finland",
    flag: "🇫🇮",
    slug: "finland-mobile-repair-software",
    population: "5.5M",
    shops: "2,345",
    growth: "23%",
    region: "Northern Europe",
    status: "Advanced",
  },
  {
    name: "Iceland",
    flag: "🇮🇸",
    slug: "iceland-mobile-repair-software",
    population: "372K",
    shops: "145",
    growth: "18%",
    region: "Northern Europe",
    status: "Boutique",
  },
]

const globalStats = {
  totalCountries: 195,
  activeMarkets: 58,
  totalShops: "850,000+",
  totalUsers: "3.2B+",
  avgGrowth: "27%",
  marketValue: "$145B",
}

export default function InternationalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")

  const filteredMarkets = globalMarkets.filter((market) => {
    const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === "" || market.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const regions = [...new Set(globalMarkets.map((market) => market.region))].sort()

  return (
    <>
      <SEOOptimizer
        title="Global Mobile Phone Repair Software | RepairHQ Worldwide Solutions"
        description="RepairHQ mobile phone repair software available worldwide. International features, multi-currency support, and local compliance for 45+ countries. Global repair shop management."
        keywords={[
          "global mobile phone repair software",
          "international repair shop software",
          "worldwide mobile repair management",
          "multi-country repair systems",
          "global repair business software",
          "international mobile repair solutions",
          "worldwide repair shop management",
          "global mobile repair platform",
          "international device repair software",
          "worldwide phone repair systems",
        ]}
        canonicalUrl="https://repairhq.com/international"
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
                  🌍 Global
                </Badge>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/locations" className="text-gray-600 hover:text-blue-600 transition-colors">
                  US Locations
                </Link>
                <Link href="/locations/states" className="text-gray-600 hover:text-blue-600 transition-colors">
                  All States
                </Link>
                <Button>Start Global Trial</Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <Globe className="h-16 w-16 text-blue-600 mr-4" />
                <div className="text-6xl">🌍</div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Global
                </span>{" "}
                Mobile Repair Software
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
                The world's first truly global mobile phone repair software. Supporting 45+ countries with local
                features, multi-currency processing, and cultural adaptations. Dominate repair markets worldwide.
              </p>

              <div className="grid md:grid-cols-6 gap-6 mb-16">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">{globalStats.activeMarkets}</div>
                  <div className="text-sm text-gray-600">Active Markets</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{globalStats.totalShops}</div>
                  <div className="text-sm text-gray-600">Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{globalStats.totalUsers}</div>
                  <div className="text-sm text-gray-600">Mobile Users</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-orange-600">{globalStats.avgGrowth}</div>
                  <div className="text-sm text-gray-600">Avg Growth</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-red-600">{globalStats.marketValue}</div>
                  <div className="text-sm text-gray-600">Market Value</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-indigo-600">24/7</div>
                  <div className="text-sm text-gray-600">Global Support</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Button size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                  Start Global Expansion
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  View Global Demo
                </Button>
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
                    placeholder="Search countries..."
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

        {/* Global Markets Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Market</h2>
              <p className="text-xl text-gray-600">Showing {filteredMarkets.length} markets with RepairHQ solutions</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMarkets.map((market, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{market.flag}</span>
                        <CardTitle className="text-lg">{market.name}</CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          market.status === "Established"
                            ? "bg-green-100 text-green-800"
                            : market.status === "Growing"
                              ? "bg-blue-100 text-blue-800"
                              : market.status === "Emerging"
                                ? "bg-yellow-100 text-yellow-800"
                                : market.status === "Massive"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                        }
                      >
                        {market.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{market.region}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-600">{market.population}</div>
                        <div className="text-xs text-gray-600">Population</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-green-600">{market.shops}</div>
                        <div className="text-xs text-gray-600">Shops</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-purple-600">{market.growth}</div>
                        <div className="text-xs text-gray-600">Growth</div>
                      </div>
                    </div>
                    <Link href={`/international/${market.slug}`}>
                      <Button className="w-full" size="sm">
                        Enter {market.name}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Global Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Features</h2>
              <p className="text-xl text-gray-600">Built for international success</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Multi-Currency</h3>
                  <p className="text-sm text-gray-600">Support for 150+ currencies with real-time exchange rates</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Multi-Language</h3>
                  <p className="text-sm text-gray-600">Native support for 25+ languages and regional dialects</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Building className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Local Compliance</h3>
                  <p className="text-sm text-gray-600">Automated compliance for local regulations and tax systems</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <TrendingUp className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                  <p className="text-sm text-gray-600">Round-the-clock support in local languages and time zones</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Regional Breakdown */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Regional Presence</h2>
              <p className="text-xl text-gray-600">Comprehensive coverage across all continents</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regions.map((region, index) => {
                const regionMarkets = globalMarkets.filter((market) => market.region === region)
                const regionShops = regionMarkets.reduce(
                  (sum, market) => sum + Number.parseInt(market.shops.replace(/,/g, "")),
                  0,
                )

                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                      <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="font-bold text-xl mb-4">{region}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{regionMarkets.length}</div>
                          <div className="text-sm text-gray-600">Countries</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{regionShops.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Shops</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready for Global Expansion?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join repair shops in 54+ countries using RepairHQ's global platform
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" variant="secondary" className="px-8">
                Start Global Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact Global Sales
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">
              Multi-currency • Multi-language • Local compliance • 24/7 global support
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
                  <span className="text-sm">🌍</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Global mobile phone repair software solutions with local features and compliance worldwide.
                </p>
              </div>

              {regions.slice(0, 4).map((region, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-4">{region}</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    {globalMarkets
                      .filter((market) => market.region === region)
                      .slice(0, 3)
                      .map((market) => (
                        <li key={market.name}>
                          <Link href={`/international/${market.slug}`}>
                            {market.flag} {market.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 RepairHQ. Global mobile phone repair software solutions worldwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

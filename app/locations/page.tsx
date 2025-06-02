"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, MapPin, CheckCircle, ArrowRight, Building2, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { SEOOptimizer } from "@/components/seo-components"

const majorCities = [
  {
    name: "New York City",
    state: "NY",
    slug: "new-york-mobile-repair-software",
    repairShops: "2,847",
    avgRevenue: "$485K",
    marketGrowth: "23%",
    description: "Dominate NYC's mobile repair market across all 5 boroughs",
    features: ["Multi-borough management", "Subway accessibility", "NYC tax compliance"],
    color: "blue",
  },
  {
    name: "Los Angeles",
    state: "CA",
    slug: "los-angeles-mobile-repair-software",
    repairShops: "3,124",
    avgRevenue: "$520K",
    marketGrowth: "28%",
    description: "Lead LA's repair market from Hollywood to Santa Monica",
    features: ["Traffic-smart scheduling", "Celebrity privacy", "CA tax compliance"],
    color: "orange",
  },
  {
    name: "Chicago",
    state: "IL",
    slug: "chicago-mobile-repair-software",
    repairShops: "1,847",
    avgRevenue: "$425K",
    marketGrowth: "22%",
    description: "Weather-resistant solutions for the Windy City",
    features: ["Weather-resistant system", "Multi-neighborhood", "IL tax compliance"],
    color: "blue",
  },
  {
    name: "Houston",
    state: "TX",
    slug: "houston-mobile-repair-software",
    repairShops: "1,654",
    avgRevenue: "$445K",
    marketGrowth: "26%",
    description: "Energy capital's premier repair software solution",
    features: ["Oil industry support", "Multi-location", "TX tax compliance"],
    color: "green",
  },
  {
    name: "Phoenix",
    state: "AZ",
    slug: "phoenix-mobile-repair-software",
    repairShops: "1,234",
    avgRevenue: "$395K",
    marketGrowth: "31%",
    description: "Desert-tested reliability for Arizona's fastest-growing city",
    features: ["Heat-resistant tracking", "Rapid expansion", "AZ tax compliance"],
    color: "red",
  },
  {
    name: "Philadelphia",
    state: "PA",
    slug: "philadelphia-mobile-repair-software",
    repairShops: "1,456",
    avgRevenue: "$415K",
    marketGrowth: "19%",
    description: "Historic city, modern repair solutions",
    features: ["Historic district support", "University partnerships", "PA tax compliance"],
    color: "purple",
  },
]

const stateStats = [
  { state: "California", cities: 15, shops: "8,500+", growth: "25%" },
  { state: "Texas", cities: 12, shops: "6,200+", growth: "24%" },
  { state: "Florida", cities: 10, shops: "4,800+", growth: "27%" },
  { state: "New York", cities: 8, shops: "4,200+", growth: "21%" },
  { state: "Illinois", cities: 6, shops: "2,800+", growth: "20%" },
  { state: "Pennsylvania", cities: 5, shops: "2,400+", growth: "18%" },
]

export default function LocationsPage() {
  return (
    <>
      <SEOOptimizer
        title="Mobile Phone Repair Software by Location | RepairHQ Local Solutions"
        description="Find RepairHQ mobile phone repair software solutions in your city. Local support for NYC, LA, Chicago, Houston, Phoenix, Philadelphia and 100+ cities nationwide. Beat local competitors with location-specific features."
        keywords={[
          "mobile phone repair software by location",
          "local repair shop software",
          "city-specific repair management",
          "regional repair software solutions",
          "local mobile repair systems",
          "repair software near me",
          "location-based repair management",
          "city repair shop software",
          "local repair business software",
          "regional mobile repair solutions",
        ]}
        canonicalUrl="https://repairhq.com/locations"
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
                  Local Solutions
                </Badge>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Pricing
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
                Local{" "}
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mobile Repair Software
                </span>{" "}
                Solutions
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
                RepairHQ provides location-specific mobile phone repair software solutions across 100+ cities
                nationwide. Get local support, city-specific features, and dominate your local repair market.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">100+</div>
                  <div className="text-sm text-gray-600">Cities Covered</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">25,000+</div>
                  <div className="text-sm text-gray-600">Local Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">24%</div>
                  <div className="text-sm text-gray-600">Avg Market Growth</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Major Cities */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Major City Solutions</h2>
              <p className="text-xl text-gray-600">
                Specialized RepairHQ solutions for America's largest repair markets
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {majorCities.map((city, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{city.name}</CardTitle>
                      <Badge variant="outline" className={`bg-${city.color}-100`}>
                        {city.state}
                      </Badge>
                    </div>
                    <CardDescription>{city.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{city.repairShops}</div>
                        <div className="text-xs text-gray-600">Shops</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{city.avgRevenue}</div>
                        <div className="text-xs text-gray-600">Avg Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{city.marketGrowth}</div>
                        <div className="text-xs text-gray-600">Growth</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {city.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Link href={`/locations/${city.slug}`}>
                      <Button className="w-full">
                        View {city.name} Solution
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* State Coverage */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Statewide Coverage</h2>
              <p className="text-xl text-gray-600">RepairHQ serves repair shops across all 50 states</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateStats.map((state, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{state.state}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>{state.cities} cities covered</div>
                      <div>{state.shops} repair shops</div>
                      <div className="text-green-600 font-medium">{state.growth} growth</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Local Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Local RepairHQ Solutions?</h2>
              <p className="text-xl text-gray-600">Get the competitive edge with location-specific features</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Local Support Teams</h3>
                  <p className="text-sm text-gray-600">Dedicated support staff in your time zone and region</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">City-Specific Features</h3>
                  <p className="text-sm text-gray-600">Features tailored to your local market and regulations</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Local Networking</h3>
                  <p className="text-sm text-gray-600">Connect with other RepairHQ users in your area</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Market Intelligence</h3>
                  <p className="text-sm text-gray-600">Local market data and competitive insights</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Find Your Local RepairHQ Solution</h2>
            <p className="text-xl mb-8 opacity-90">
              Get started with location-specific features and local support in your city
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" variant="secondary" className="px-8">
                Find My City
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact Local Team
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">Available in 100+ cities • Local support • City-specific features</p>
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
                  Local mobile phone repair software solutions for businesses nationwide.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Major Cities</h3>
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
                <h3 className="font-semibold mb-4">Regional Support</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>West Coast</li>
                  <li>East Coast</li>
                  <li>Midwest</li>
                  <li>Southwest</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Local Features</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>Tax Compliance</li>
                  <li>Local Support</li>
                  <li>Market Intelligence</li>
                  <li>Regional Networking</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 RepairHQ. Local mobile phone repair software solutions nationwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

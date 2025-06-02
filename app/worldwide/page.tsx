"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, Smartphone, TrendingUp, MapPin, Star, ArrowRight, Building, Zap } from "lucide-react"
import { SEOOptimizer } from "@/components/seo-components"

const globalStats = [
  { region: "North America", countries: 3, shops: "45,000+", growth: "28%" },
  { region: "Europe", countries: 27, shops: "78,000+", growth: "32%" },
  { region: "Asia Pacific", countries: 15, shops: "125,000+", growth: "45%" },
  { region: "Latin America", countries: 12, shops: "35,000+", growth: "38%" },
  { region: "Middle East & Africa", countries: 8, shops: "18,000+", growth: "42%" },
]

const featuredCountries = [
  { name: "United States", flag: "🇺🇸", shops: "25,000+", growth: "25%" },
  { name: "United Kingdom", flag: "🇬🇧", shops: "18,000+", growth: "22%" },
  { name: "Germany", flag: "🇩🇪", shops: "15,000+", growth: "28%" },
  { name: "Canada", flag: "🇨🇦", shops: "12,000+", growth: "24%" },
  { name: "Australia", flag: "🇦🇺", shops: "8,500+", growth: "26%" },
  { name: "France", flag: "🇫🇷", shops: "12,000+", growth: "23%" },
  { name: "Japan", flag: "🇯🇵", shops: "22,000+", growth: "35%" },
  { name: "India", flag: "🇮🇳", shops: "45,000+", growth: "52%" },
  { name: "Brazil", flag: "🇧🇷", shops: "18,000+", growth: "41%" },
  { name: "Mexico", flag: "🇲🇽", shops: "15,000+", growth: "38%" },
  { name: "Ukraine", flag: "🇺🇦", shops: "8,500+", growth: "48%" },
  { name: "Pakistan", flag: "🇵🇰", shops: "25,000+", growth: "55%" },
]

export default function WorldwidePage() {
  return (
    <>
      <SEOOptimizer
        title="Worldwide Mobile Phone Repair Software | RepairHQ Global Solutions"
        description="RepairHQ serves 300,000+ repair shops across 65+ countries worldwide. Global mobile phone repair software with local features, multi-currency support, and 24/7 international support."
        keywords={[
          "worldwide mobile repair software",
          "global repair shop software",
          "international mobile repair system",
          "multi-country repair management",
          "global phone repair solution",
          "worldwide repair business software",
          "international repair shop system",
          "global mobile repair platform",
        ]}
        canonicalUrl="https://repairhq.com/worldwide"
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Globe className="h-16 w-16 text-blue-600 mr-4" />
                <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">Global Leader</Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Worldwide{" "}
                <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mobile Repair
                </span>{" "}
                Domination
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                The world's #1 mobile phone repair software. Trusted by 300,000+ repair shops across 65+ countries.
                Local features, global reach.
              </p>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">300K+</div>
                  <div className="text-sm text-gray-600">Global Repair Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">65+</div>
                  <div className="text-sm text-gray-600">Countries Served</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">35%</div>
                  <div className="text-sm text-gray-600">Average Growth</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-orange-600">24/7</div>
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

        {/* Global Reach Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Reach</h2>
              <p className="text-xl text-gray-600">RepairHQ serves repair shops across all continents</p>
            </div>

            <div className="grid md:grid-cols-5 gap-6 mb-16">
              {globalStats.map((region, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{region.region}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-600">{region.countries} countries</div>
                      <div className="text-blue-600 font-medium">{region.shops} shops</div>
                      <div className="text-green-600 font-medium">{region.growth} growth</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Countries</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {featuredCountries.map((country, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="text-3xl mb-2">{country.flag}</div>
                      <div className="font-medium text-sm">{country.name}</div>
                      <div className="text-xs text-blue-600">{country.shops}</div>
                      <div className="text-xs text-green-600">{country.growth}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Global Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Global Operations</h2>
              <p className="text-xl text-gray-600">Features designed for worldwide success</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Multi-Currency Support",
                  description: "Support for 150+ currencies with real-time exchange rates",
                },
                {
                  icon: Users,
                  title: "Multi-Language Interface",
                  description: "Available in 25+ languages with local translations",
                },
                {
                  icon: Smartphone,
                  title: "Local Compliance",
                  description: "Tax systems, regulations, and business rules for each country",
                },
                {
                  icon: TrendingUp,
                  title: "Global Analytics",
                  description: "Cross-country performance tracking and insights",
                },
                {
                  icon: Building,
                  title: "Local Support Teams",
                  description: "Support teams in major time zones and languages",
                },
                {
                  icon: Zap,
                  title: "Regional Integrations",
                  description: "Local payment processors, shipping, and business tools",
                },
                {
                  icon: Star,
                  title: "Cultural Adaptations",
                  description: "Business practices adapted to local cultures",
                },
                {
                  icon: MapPin,
                  title: "Global Infrastructure",
                  description: "Data centers worldwide for optimal performance",
                },
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Success Stories</h2>
              <p className="text-xl text-gray-600">Repair businesses thriving worldwide with RepairHQ</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  flag: "🇺🇸",
                  country: "United States",
                  business: "TechFix USA",
                  quote:
                    "RepairHQ helped us expand from 1 to 50 locations across 12 states. The multi-location features are incredible!",
                  growth: "5000% growth in 3 years",
                },
                {
                  flag: "🇮🇳",
                  country: "India",
                  business: "Mumbai Mobile Masters",
                  quote:
                    "The Hindi interface and rupee support made RepairHQ perfect for the Indian market. We've grown 400% this year!",
                  growth: "400% annual growth",
                },
                {
                  flag: "🇺🇦",
                  country: "Ukraine",
                  business: "Kyiv Phone Repair",
                  quote:
                    "Even during challenging times, RepairHQ's reliability and cryptocurrency support kept our business running.",
                  growth: "Maintained operations during crisis",
                },
              ].map((story, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl mr-3">{story.flag}</span>
                      <div>
                        <div className="font-bold">{story.business}</div>
                        <div className="text-sm text-gray-600">{story.country}</div>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 mb-4 italic">"{story.quote}"</blockquote>
                    <div className="text-sm font-medium text-green-600">{story.growth}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Global Support Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">24/7 Global Support</h2>
              <p className="text-xl text-gray-600">Support teams around the world, in your language</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Americas Support</h3>
                <p className="text-gray-600 mb-4">English, Spanish, Portuguese, French</p>
                <p className="text-sm text-gray-500">Coverage: UTC-8 to UTC-3</p>
              </Card>

              <Card className="text-center p-8">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Europe & Africa Support</h3>
                <p className="text-gray-600 mb-4">English, German, French, Italian, Spanish, Arabic</p>
                <p className="text-sm text-gray-500">Coverage: UTC-1 to UTC+3</p>
              </Card>

              <Card className="text-center p-8">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Asia Pacific Support</h3>
                <p className="text-gray-600 mb-4">English, Hindi, Japanese, Korean, Chinese</p>
                <p className="text-sm text-gray-500">Coverage: UTC+5 to UTC+12</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready for Global Domination?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join 300,000+ repair shops worldwide using RepairHQ to grow their business
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
                Contact Global Team
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              Available in 65+ countries • 25+ languages • 150+ currencies • 24/7 support
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

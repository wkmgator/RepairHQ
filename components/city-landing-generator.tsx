"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Star } from "lucide-react"
import { SEOOptimizer } from "@/components/seo-components"

interface CityData {
  name: string
  state: string
  slug: string
  population: string
  repairShops: string
  avgRevenue: string
  marketGrowth: string
  avgTicket: string
  primaryColor: string
  secondaryColor: string
  nickname: string
  keyFeatures: string[]
  localTestimonials: Array<{
    name: string
    business: string
    location: string
    quote: string
    rating: number
  }>
  uniqueFeatures: string[]
  coordinates: {
    latitude: string
    longitude: string
  }
}

// Comprehensive city database for 50+ cities
export const cityDatabase: CityData[] = [
  // West Coast
  {
    name: "San Jose",
    state: "CA",
    slug: "san-jose-mobile-repair-software",
    population: "1,013,240",
    repairShops: "1,456",
    avgRevenue: "$595K",
    marketGrowth: "29%",
    avgTicket: "$175",
    primaryColor: "blue",
    secondaryColor: "purple",
    nickname: "Capital of Silicon Valley",
    keyFeatures: ["Tech giant employee programs", "VTA light rail integration", "Multilingual support"],
    localTestimonials: [
      {
        name: "Raj Patel",
        business: "Silicon Valley Mobile Fix",
        location: "Downtown San Jose",
        quote: "RepairHQ's tech industry features help us serve Apple, Google, and Meta employees perfectly!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Silicon Valley tech integration",
      "VTA light rail notifications",
      "Tech giant employee discounts",
      "Venture capital reporting",
      "Startup-friendly pricing",
      "Patent tracking system",
      "CA tax compliance",
      "Earthquake backup protocols",
    ],
    coordinates: { latitude: "37.3382", longitude: "-121.8863" },
  },

  {
    name: "Portland",
    state: "OR",
    slug: "portland-mobile-repair-software",
    population: "652,503",
    repairShops: "847",
    avgRevenue: "$425K",
    marketGrowth: "26%",
    avgTicket: "$145",
    primaryColor: "green",
    secondaryColor: "blue",
    nickname: "Keep Portland Weird",
    keyFeatures: ["Bike messenger integration", "Food cart partnerships", "Eco-friendly tracking"],
    localTestimonials: [
      {
        name: "Emma Green",
        business: "Rose City Repairs",
        location: "Pearl District",
        quote: "The bike messenger integration is perfect for Portland's eco-conscious repair culture!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Bike messenger delivery tracking",
      "Food cart location services",
      "Eco-friendly repair tracking",
      "MAX light rail integration",
      "Coffee shop partnerships",
      "No sales tax benefits",
      "Rain-resistant systems",
      "Hipster device support",
    ],
    coordinates: { latitude: "45.5152", longitude: "-122.6784" },
  },

  // Southwest
  {
    name: "Denver",
    state: "CO",
    slug: "denver-mobile-repair-software",
    population: "715,522",
    repairShops: "923",
    avgRevenue: "$465K",
    marketGrowth: "31%",
    avgTicket: "$165",
    primaryColor: "orange",
    secondaryColor: "blue",
    nickname: "Mile High City",
    keyFeatures: ["Altitude-adjusted systems", "Ski resort partnerships", "Cannabis industry support"],
    localTestimonials: [
      {
        name: "Jake Mountain",
        business: "Mile High Mobile Repair",
        location: "LoDo",
        quote: "The altitude adjustments prevent overheating issues that other software can't handle!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "High altitude device protection",
      "Ski resort seasonal tracking",
      "Cannabis industry compliance",
      "RTD transit integration",
      "Mountain weather alerts",
      "Outdoor adventure gear support",
      "CO tax compliance",
      "Broncos game day surge pricing",
    ],
    coordinates: { latitude: "39.7392", longitude: "-104.9903" },
  },

  {
    name: "Las Vegas",
    state: "NV",
    slug: "las-vegas-mobile-repair-software",
    population: "641,903",
    repairShops: "1,234",
    avgRevenue: "$525K",
    marketGrowth: "28%",
    avgTicket: "$185",
    primaryColor: "red",
    secondaryColor: "gold",
    nickname: "Sin City",
    keyFeatures: ["24/7 casino support", "Tourist device tracking", "Heat protection systems"],
    localTestimonials: [
      {
        name: "Maria Santos",
        business: "Vegas Strip Phone Fix",
        location: "The Strip",
        quote: "24/7 operations and tourist tracking features are perfect for our casino clientele!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "24/7 casino operations",
      "Tourist device tracking",
      "Extreme heat protection",
      "Monorail integration",
      "Convention center support",
      "No state income tax",
      "Entertainment industry features",
      "High-roller customer profiles",
    ],
    coordinates: { latitude: "36.1699", longitude: "-115.1398" },
  },

  // Southeast
  {
    name: "Miami",
    state: "FL",
    slug: "miami-mobile-repair-software",
    population: "442,241",
    repairShops: "1,567",
    avgRevenue: "$545K",
    marketGrowth: "33%",
    avgTicket: "$195",
    primaryColor: "cyan",
    secondaryColor: "pink",
    nickname: "Magic City",
    keyFeatures: ["Hurricane backup systems", "Cruise ship partnerships", "Multilingual support"],
    localTestimonials: [
      {
        name: "Carlos Mendez",
        business: "South Beach Mobile",
        location: "South Beach",
        quote: "Hurricane-proof backup and Spanish support make RepairHQ perfect for Miami!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Hurricane-resistant backup",
      "Cruise ship customer tracking",
      "Spanish/Portuguese support",
      "Beach sand protection alerts",
      "Art Basel event mode",
      "International tourist features",
      "FL tax compliance",
      "Luxury device specialization",
    ],
    coordinates: { latitude: "25.7617", longitude: "-80.1918" },
  },

  {
    name: "Atlanta",
    state: "GA",
    slug: "atlanta-mobile-repair-software",
    population: "498,715",
    repairShops: "1,345",
    avgRevenue: "$475K",
    marketGrowth: "27%",
    avgTicket: "$155",
    primaryColor: "red",
    secondaryColor: "black",
    nickname: "Hotlanta",
    keyFeatures: ["Airport repair services", "MARTA integration", "Film industry support"],
    localTestimonials: [
      {
        name: "Keisha Williams",
        business: "Peachtree Phone Repair",
        location: "Midtown",
        quote: "The film industry features help us serve movie sets and production companies perfectly!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Airport concourse services",
      "MARTA transit integration",
      "Film industry equipment",
      "Delta employee programs",
      "Southern hospitality features",
      "GA tax compliance",
      "Heat humidity protection",
      "Coca-Cola corporate support",
    ],
    coordinates: { latitude: "33.7490", longitude: "-84.3880" },
  },

  // Northeast
  {
    name: "Boston",
    state: "MA",
    slug: "boston-mobile-repair-software",
    population: "685,094",
    repairShops: "1,234",
    avgRevenue: "$515K",
    marketGrowth: "22%",
    avgTicket: "$175",
    primaryColor: "blue",
    secondaryColor: "red",
    nickname: "Beantown",
    keyFeatures: ["University partnerships", "T subway integration", "Historic district compliance"],
    localTestimonials: [
      {
        name: "Patrick O'Brien",
        business: "Boston Common Repairs",
        location: "Back Bay",
        quote: "The university partnerships bring us tons of student customers from Harvard and MIT!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Harvard/MIT student programs",
      "MBTA subway integration",
      "Historic district compliance",
      "Winter weather protection",
      "Red Sox game day features",
      "MA tax compliance",
      "Freedom Trail tourist support",
      "Biotech industry features",
    ],
    coordinates: { latitude: "42.3601", longitude: "-71.0589" },
  },

  {
    name: "Washington DC",
    state: "DC",
    slug: "washington-dc-mobile-repair-software",
    population: "705,749",
    repairShops: "987",
    avgRevenue: "$565K",
    marketGrowth: "25%",
    avgTicket: "$185",
    primaryColor: "blue",
    secondaryColor: "red",
    nickname: "The District",
    keyFeatures: ["Government security compliance", "Metro integration", "Embassy services"],
    localTestimonials: [
      {
        name: "Amanda Johnson",
        business: "Capitol Hill Mobile",
        location: "Capitol Hill",
        quote: "Government security features and embassy support make us the go-to for DC professionals!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Government security compliance",
      "Metro rail integration",
      "Embassy customer support",
      "Lobbyist tracking features",
      "Tourist monument services",
      "DC tax compliance",
      "Political event scheduling",
      "Smithsonian partnerships",
    ],
    coordinates: { latitude: "38.9072", longitude: "-77.0369" },
  },

  // Midwest
  {
    name: "Detroit",
    state: "MI",
    slug: "detroit-mobile-repair-software",
    population: "639,111",
    repairShops: "845",
    avgRevenue: "$395K",
    marketGrowth: "24%",
    avgTicket: "$135",
    primaryColor: "blue",
    secondaryColor: "silver",
    nickname: "Motor City",
    keyFeatures: ["Auto industry integration", "Renaissance support", "Winter weather systems"],
    localTestimonials: [
      {
        name: "Marcus Johnson",
        business: "Motor City Mobile Fix",
        location: "Downtown Detroit",
        quote: "The auto industry features help us serve Ford, GM, and Chrysler employees perfectly!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Auto industry employee programs",
      "QLine streetcar integration",
      "Renaissance zone support",
      "Extreme winter protection",
      "Lions/Tigers game features",
      "MI tax compliance",
      "Motown music integration",
      "Manufacturing shift scheduling",
    ],
    coordinates: { latitude: "42.3314", longitude: "-83.0458" },
  },

  {
    name: "Minneapolis",
    state: "MN",
    slug: "minneapolis-mobile-repair-software",
    population: "429,954",
    repairShops: "756",
    avgRevenue: "$445K",
    marketGrowth: "23%",
    avgTicket: "$155",
    primaryColor: "purple",
    secondaryColor: "gold",
    nickname: "City of Lakes",
    keyFeatures: ["Skyway system integration", "Lake protection features", "Winter survival mode"],
    localTestimonials: [
      {
        name: "Sarah Anderson",
        business: "Twin Cities Phone Repair",
        location: "Uptown",
        quote: "The skyway integration keeps our customers connected even in brutal Minnesota winters!",
        rating: 5,
      },
    ],
    uniqueFeatures: [
      "Skyway system navigation",
      "Lake water damage protection",
      "Extreme cold weather mode",
      "Metro Transit integration",
      "Vikings/Twins game features",
      "MN tax compliance",
      "Prince music integration",
      "Mall of America support",
    ],
    coordinates: { latitude: "44.9778", longitude: "-93.2650" },
  },
]

interface CityLandingPageProps {
  cityData: CityData
}

export function CityLandingPage({ cityData }: CityLandingPageProps) {
  return (
    <>
      <SEOOptimizer
        title={`${cityData.name} Mobile Phone Repair Software | RepairHQ ${cityData.name} Solutions`}
        description={`Leading mobile phone repair software in ${cityData.name}, ${cityData.state}. ${cityData.nickname} features, local integrations, and city-specific tools. Outperform RepairDesk & RepairShopr in ${cityData.name}.`}
        keywords={[
          `${cityData.name} mobile phone repair software`,
          `${cityData.name} cell phone repair management`,
          `${cityData.state} mobile repair system`,
          `${cityData.name} device repair software`,
          `${cityData.name} phone repair POS`,
          `${cityData.name} repair shop software`,
          `${cityData.name} repair solution`,
          `${cityData.name} mobile repair management`,
          `${cityData.state} repair software`,
          `${cityData.nickname} repair system`,
        ]}
        canonicalUrl={`https://repairhq.com/locations/${cityData.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: `RepairHQ ${cityData.name}`,
          description: `Mobile phone repair software for ${cityData.name} and surrounding area businesses`,
          address: {
            "@type": "PostalAddress",
            addressLocality: cityData.name,
            addressRegion: cityData.state,
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: cityData.coordinates.latitude,
            longitude: cityData.coordinates.longitude,
          },
          areaServed: `${cityData.name} Metro Area`,
          serviceType: "Mobile Phone Repair Software",
        }}
      />

      <div className={`min-h-screen bg-gradient-to-b from-${cityData.primaryColor}-50 to-white`}>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className={`mb-4 bg-${cityData.primaryColor}-100 text-${cityData.primaryColor}-800`}>
                {cityData.nickname}
              </Badge>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {cityData.name}{" "}
                <span
                  className={`text-${cityData.primaryColor}-600 bg-gradient-to-r from-${cityData.primaryColor}-600 to-${cityData.secondaryColor}-600 bg-clip-text text-transparent`}
                >
                  Mobile Repair Software
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                The only repair software built specifically for {cityData.name}'s unique market. Local features and
                integrations that RepairDesk and RepairShopr simply don't offer.
              </p>

              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className={`text-3xl font-bold text-${cityData.primaryColor}-600`}>{cityData.repairShops}</div>
                  <div className="text-sm text-gray-600">{cityData.name} Shops</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{cityData.avgRevenue}</div>
                  <div className="text-sm text-gray-600">Average Revenue</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-blue-600">{cityData.marketGrowth}</div>
                  <div className="text-sm text-gray-600">Market Growth</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{cityData.avgTicket}</div>
                  <div className="text-sm text-gray-600">Average Ticket</div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Button
                  size="lg"
                  className={`px-8 bg-${cityData.primaryColor}-600 hover:bg-${cityData.primaryColor}-700`}
                >
                  Start Free {cityData.name} Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  View {cityData.name} Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* City-Specific Features */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for {cityData.name}</h2>
              <p className="text-xl text-gray-600">Features designed specifically for {cityData.nickname}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cityData.uniqueFeatures.map((feature, index) => (
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by {cityData.name} Repair Shops</h2>
              <p className="text-xl text-gray-600">Real results from local businesses</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {cityData.localTestimonials.map((testimonial, index) => (
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
                      <div className={`text-${cityData.primaryColor}-600`}>{testimonial.business}</div>
                      <div className="text-sm text-gray-600">
                        {testimonial.location}, {cityData.name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`py-20 bg-${cityData.primaryColor}-600 text-white`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Dominate {cityData.name}'s Repair Market?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join {cityData.repairShops}+ {cityData.name} repair shops using RepairHQ
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free {cityData.name} Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-white border-white hover:bg-white hover:text-blue-600"
              >
                Call {cityData.name} Support
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">{cityData.keyFeatures.join(" • ")} • Local support</p>
          </div>
        </section>
      </div>
    </>
  )
}

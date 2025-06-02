import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getVerticalLandingData, getAllVerticalSlugs } from "@/lib/vertical-landing-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Check, ArrowRight, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { generateSoftwareApplicationSchema, generateFAQSchema } from "@/lib/schema-generator"

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = getAllVerticalSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vertical = getVerticalLandingData(params.slug)

  if (!vertical) {
    return {
      title: "Repair Business Software | RepairHQ",
      description: "All-in-one repair management platform",
    }
  }

  const title = `${vertical.h1} Software | RepairHQ`
  const description =
    vertical.description ||
    `Complete ${vertical.h1.toLowerCase()} repair shop management system. Streamline operations, increase revenue, and delight customers with RepairHQ.`

  return {
    title,
    description,
    keywords: vertical.keywords,
    openGraph: {
      title,
      description,
      url: `https://repairhq.io/repair/${vertical.slug}`,
      siteName: "RepairHQ",
      images: [
        {
          url: vertical.heroImage || "/images/og-default.jpg",
          width: 1200,
          height: 630,
          alt: vertical.h1,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [vertical.heroImage || "/images/og-default.jpg"],
      creator: "@RepairHQ",
      site: "@RepairHQ",
    },
    alternates: {
      canonical: `https://repairhq.io/repair/${vertical.slug}`,
      languages: {
        en: `https://repairhq.io/repair/${vertical.slug}`,
        es: `https://repairhq.io/es/repair/${vertical.slug}`,
        fr: `https://repairhq.io/fr/repair/${vertical.slug}`,
        de: `https://repairhq.io/de/repair/${vertical.slug}`,
      },
    },
  }
}

export default function VerticalLandingPage({ params }: Props) {
  const vertical = getVerticalLandingData(params.slug)

  if (!vertical) {
    notFound()
  }

  // Generate structured data for this vertical
  const softwareAppSchema = generateSoftwareApplicationSchema({
    name: `RepairHQ ${vertical.h1} Software`,
    description: vertical.description,
    image: vertical.heroImage || "/images/og-default.jpg",
    offers: {
      price: 29,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `https://repairhq.io/repair/${vertical.slug}`,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    },
    aggregateRating: {
      ratingValue: 4.9,
      reviewCount: 150,
    },
  })

  const faqSchema = generateFAQSchema(vertical.faq)

  // Combine schemas
  const structuredData = [softwareAppSchema, faqSchema]

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                  #1 Repair Management Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">{vertical.h1}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{vertical.subtitle}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/auth/signup">
                    {vertical.ctaText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <span>4.9/5 from 150+ repair shops</span>
              </div>
            </div>

            <div className="relative">
              <Image
                src={vertical.heroImage || "/placeholder.svg"}
                alt={vertical.h1}
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your {vertical.slug.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
              Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RepairHQ provides all the tools you need to streamline operations and grow your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vertical.features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16 bg-blue-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Repair Shops Choose RepairHQ</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {vertical.benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-16 bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Trusted by Repair Professionals</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {vertical.testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4 italic">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.business}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {vertical.faq.map((item, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 bg-blue-600 text-white">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Transform Your Repair Business?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of repair shops already using RepairHQ to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-16 bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Getting Started?</h2>
            <p className="text-xl text-gray-600">Our team is here to help you succeed</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">1-800-REPAIR-HQ</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600">support@repairhq.io</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

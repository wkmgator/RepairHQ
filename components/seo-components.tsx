"use client"

import { useEffect } from "react"
import Head from "next/head"

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  structuredData?: object
}

export function SEOOptimizer({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = "/og-image.jpg",
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // Add structured data if provided
    if (structuredData) {
      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.text = JSON.stringify(structuredData)
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [structuredData])

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  )
}

// Schema.org structured data generators
export const generateSoftwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RepairHQ - Mobile Phone Repair Software",
  description:
    "The world's #1 mobile phone repair software. Complete repair shop management system with AI diagnostics, inventory management, and customer CRM.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  offers: {
    "@type": "Offer",
    price: "29",
    priceCurrency: "USD",
    priceValidUntil: "2024-12-31",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1247",
    bestRating: "5",
    worstRating: "1",
  },
  author: {
    "@type": "Organization",
    name: "RepairHQ",
    url: "https://repairhq.com",
  },
})

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RepairHQ",
  url: "https://repairhq.com",
  logo: "https://repairhq.com/logo.png",
  description: "The world's #1 mobile phone repair software",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Tech Street",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94105",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-REPAIR-HQ",
    contactType: "customer service",
    availableLanguage: ["English", "Spanish", "French"],
  },
  sameAs: ["https://twitter.com/RepairHQ", "https://facebook.com/RepairHQ", "https://linkedin.com/company/repairhq"],
})

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
})

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
})

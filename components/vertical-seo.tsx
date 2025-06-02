import { EnhancedSEO, type SEOProps } from "./enhanced-seo"

interface VerticalSEOProps extends Omit<SEOProps, "structuredData"> {
  verticalName: string
  verticalSlug: string
  location?: string
  features?: string[]
  rating?: number
  reviewCount?: number
  pricing?: {
    currency: string
    amount: number
    priceValidUntil?: string
  }
}

export function VerticalSEO({
  verticalName,
  verticalSlug,
  location,
  features = [],
  rating,
  reviewCount,
  pricing,
  ...seoProps
}: VerticalSEOProps) {
  // Generate dynamic title and description if not provided
  const title = seoProps.title || `${verticalName} Repair Software | RepairHQ`
  const description =
    seoProps.description ||
    `Complete ${verticalName.toLowerCase()} repair shop management system. Streamline operations, increase revenue, and delight customers with RepairHQ.`

  // Generate keywords if not provided
  const keywords = seoProps.keywords?.length
    ? seoProps.keywords
    : [
        `${verticalName} repair software`,
        `${verticalName} shop management`,
        `${verticalName} repair business`,
        `${verticalName} repair POS`,
        `${verticalName} repair CRM`,
        "repair shop software",
        "repair management system",
        "RepairHQ",
      ]

  // Add location to keywords if provided
  if (location) {
    keywords.push(`${verticalName} repair software ${location}`)
    keywords.push(`${location} ${verticalName} repair shop`)
  }

  // Generate structured data for this vertical
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `RepairHQ ${verticalName} Repair Software`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description: description,
    offers: pricing
      ? {
          "@type": "Offer",
          price: pricing.amount.toString(),
          priceCurrency: pricing.currency,
          ...(pricing.priceValidUntil && { priceValidUntil: pricing.priceValidUntil }),
        }
      : undefined,
    ...(rating && reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.toString(),
            reviewCount: reviewCount.toString(),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    featureList: features.join(", "),
    url: `https://repairhq.io/repair/${verticalSlug}`,
    provider: {
      "@type": "Organization",
      name: "RepairHQ",
      logo: "https://repairhq.io/images/logo.png",
    },
  }

  // Generate alternate language URLs
  const alternateLanguages = {
    en: `https://repairhq.io/repair/${verticalSlug}`,
    es: `https://repairhq.io/es/repair/${verticalSlug}`,
    fr: `https://repairhq.io/fr/repair/${verticalSlug}`,
  }

  return (
    <EnhancedSEO
      title={title}
      description={description}
      keywords={keywords}
      structuredData={structuredData}
      alternateLanguages={alternateLanguages}
      {...seoProps}
    />
  )
}

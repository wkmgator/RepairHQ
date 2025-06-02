export interface BusinessInfo {
  name: string
  description: string
  url: string
  logo?: string
  telephone?: string
  email?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  sameAs?: string[]
}

export interface ProductInfo {
  name: string
  description: string
  image?: string
  sku?: string
  brand?: string
  offers?: {
    price: number
    priceCurrency: string
    availability?: string
    url?: string
    priceValidUntil?: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

export interface FAQItem {
  question: string
  answer: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateOrganizationSchema(info: BusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: info.name,
    description: info.description,
    url: info.url,
    ...(info.logo && { logo: info.logo }),
    ...(info.telephone && { telephone: info.telephone }),
    ...(info.email && { email: info.email }),
    ...(info.address && {
      address: {
        "@type": "PostalAddress",
        ...info.address,
      },
    }),
    ...(info.sameAs && { sameAs: info.sameAs }),
  }
}

export function generateProductSchema(info: ProductInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: info.name,
    description: info.description,
    ...(info.image && { image: info.image }),
    ...(info.sku && { sku: info.sku }),
    ...(info.brand && {
      brand: {
        "@type": "Brand",
        name: info.brand,
      },
    }),
    ...(info.offers && {
      offers: {
        "@type": "Offer",
        price: info.offers.price,
        priceCurrency: info.offers.priceCurrency,
        ...(info.offers.availability && { availability: info.offers.availability }),
        ...(info.offers.url && { url: info.offers.url }),
        ...(info.offers.priceValidUntil && { priceValidUntil: info.offers.priceValidUntil }),
      },
    }),
    ...(info.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: info.aggregateRating.ratingValue,
        reviewCount: info.aggregateRating.reviewCount,
      },
    }),
  }
}

export function generateSoftwareApplicationSchema(info: ProductInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: info.name,
    description: info.description,
    applicationCategory: "BusinessApplication",
    ...(info.image && { image: info.image }),
    ...(info.offers && {
      offers: {
        "@type": "Offer",
        price: info.offers.price,
        priceCurrency: info.offers.priceCurrency,
        ...(info.offers.availability && { availability: info.offers.availability }),
        ...(info.offers.url && { url: info.offers.url }),
        ...(info.offers.priceValidUntil && { priceValidUntil: info.offers.priceValidUntil }),
      },
    }),
    ...(info.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: info.aggregateRating.ratingValue,
        reviewCount: info.aggregateRating.reviewCount,
        bestRating: "5",
        worstRating: "1",
      },
    }),
  }
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
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
  }
}

export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

export function generateLocalBusinessSchema(
  info: BusinessInfo & {
    priceRange?: string
    openingHours?: string[]
    geo?: {
      latitude: number
      longitude: number
    }
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: info.name,
    description: info.description,
    url: info.url,
    ...(info.logo && { image: info.logo }),
    ...(info.telephone && { telephone: info.telephone }),
    ...(info.email && { email: info.email }),
    ...(info.address && {
      address: {
        "@type": "PostalAddress",
        ...info.address,
      },
    }),
    ...(info.priceRange && { priceRange: info.priceRange }),
    ...(info.openingHours && { openingHoursSpecification: info.openingHours }),
    ...(info.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: info.geo.latitude,
        longitude: info.geo.longitude,
      },
    }),
    ...(info.sameAs && { sameAs: info.sameAs }),
  }
}

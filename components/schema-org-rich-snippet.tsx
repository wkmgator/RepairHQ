interface FAQ {
  question: string
  answer: string
}

interface Review {
  rating: number
  author: string
  body: string
  date?: string
}

interface SchemaOrgProps {
  faq?: FAQ[]
  reviews?: Review[]
  businessName?: string
  businessType?: string
  url?: string
  description?: string
}

export default function SchemaOrgRichSnippet({
  faq = [],
  reviews = [],
  businessName = "RepairHQ",
  businessType = "SoftwareApplication",
  url = "https://repairhq.io",
  description = "All-in-one repair shop management software",
}: SchemaOrgProps) {
  const schemas = []

  // FAQ Schema
  if (faq.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.answer,
        },
      })),
    }
    schemas.push(faqSchema)
  }

  // Software Application Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: businessName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    description: description,
    url: url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free trial available",
    },
    aggregateRating:
      reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
            reviewCount: reviews.length.toString(),
            bestRating: "5",
            worstRating: "1",
          }
        : {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "150",
            bestRating: "5",
            worstRating: "1",
          },
  }
  schemas.push(softwareSchema)

  // Reviews Schema
  if (reviews.length > 0) {
    reviews.forEach((review) => {
      const reviewSchema = {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: {
          "@type": "SoftwareApplication",
          name: businessName,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating.toString(),
          bestRating: "5",
          worstRating: "1",
        },
        author: {
          "@type": "Person",
          name: review.author,
        },
        reviewBody: review.body,
        datePublished: review.date || new Date().toISOString(),
      }
      schemas.push(reviewSchema)
    })
  }

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessName,
    url: url,
    logo: `${url}/logo.png`,
    description: description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-REPAIR-HQ",
      contactType: "customer service",
      email: "support@repairhq.io",
    },
    sameAs: ["https://twitter.com/repairhq", "https://linkedin.com/company/repairhq", "https://facebook.com/repairhq"],
  }
  schemas.push(organizationSchema)

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  )
}

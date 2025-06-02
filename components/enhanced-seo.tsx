"use client"

import Head from "next/head"
import { useRouter } from "next/router"

export interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  twitterCard?: "summary" | "summary_large_image" | "app" | "player"
  canonicalUrl?: string
  structuredData?: object | object[]
  noindex?: boolean
  alternateLanguages?: { [locale: string]: string }
}

export function EnhancedSEO({
  title,
  description,
  keywords = [],
  ogImage = "/images/og-default.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
  structuredData,
  noindex = false,
  alternateLanguages = {},
}: SEOProps) {
  const router = useRouter()
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://repairhq.io"
  const fullCanonicalUrl = canonicalUrl || `${siteUrl}${router.asPath}`
  const fullOgImageUrl = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="RepairHQ" />
      <meta property="og:locale" content={router.locale || "en"} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@RepairHQ" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {/* Alternate Language Tags */}
      {Object.entries(alternateLanguages).map(([locale, url]) => (
        <link key={locale} rel="alternate" hrefLang={locale} href={url} />
      ))}

      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  )
}

import Head from "next/head"

interface SEOMetaTagsProps {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  noindex?: boolean
}

export default function SEOMetaTags({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = "/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  noindex = false,
}: SEOMetaTagsProps) {
  const fullTitle = title.includes("RepairHQ") ? title : `${title} | RepairHQ`
  const fullCanonical = canonical || `https://repairhq.io`
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `https://repairhq.io${ogImage}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <meta name="author" content="RepairHQ" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="RepairHQ" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#2563eb" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </Head>
  )
}

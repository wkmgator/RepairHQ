import { getAllVerticalSlugs } from "@/lib/vertical-landing-config"
import { getInternationalLocations } from "@/lib/international-landing-generator"
import { getLocationSlugs } from "@/lib/city-landing-generator"
import { getStateSlugs } from "@/lib/state-landing-generator"

export async function GET() {
  // Get all dynamic slugs
  const verticals = getAllVerticalSlugs()
  const locations = getLocationSlugs()
  const states = getStateSlugs()
  const internationalLocations = getInternationalLocations()

  // Core pages
  const corePages = [
    "",
    "pricing",
    "features",
    "about",
    "contact",
    "blog",
    "auth/signin",
    "auth/signup",
    "pricing/starter-plan",
    "pricing/pro-plan",
    "pricing/enterprise-plan",
    "pricing/franchise-plan",
  ]

  // Supported languages
  const languages = ["en", "es", "fr", "de", "ja", "zh", "ar"]

  // Generate all URLs
  const coreUrls = corePages
    .flatMap((page) =>
      languages.map((lang) => {
        const langPrefix = lang === "en" ? "" : `/${lang}`
        return `
  <url>
    <loc>https://repairhq.io${langPrefix}/${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === "" ? "daily" : "weekly"}</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
    ${languages
      .map(
        (l) =>
          `<xhtml:link rel="alternate" hreflang="${l}" href="https://repairhq.io${l === "en" ? "" : `/${l}`}/${page}" />`,
      )
      .join("\n    ")}
  </url>`
      }),
    )
    .join("")

  const verticalUrls = verticals
    .flatMap((slug) =>
      languages.map((lang) => {
        const langPrefix = lang === "en" ? "" : `/${lang}`
        return `
  <url>
    <loc>https://repairhq.io${langPrefix}/repair/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    ${languages
      .map(
        (l) =>
          `<xhtml:link rel="alternate" hreflang="${l}" href="https://repairhq.io${l === "en" ? "" : `/${l}`}/repair/${slug}" />`,
      )
      .join("\n    ")}
  </url>`
      }),
    )
    .join("")

  const locationUrls = locations
    .map(
      (slug) => `
  <url>
    <loc>https://repairhq.io/locations/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")

  const stateUrls = states
    .map(
      (slug) => `
  <url>
    <loc>https://repairhq.io/locations/states/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")

  const internationalUrls = internationalLocations
    .map(
      (slug) => `
  <url>
    <loc>https://repairhq.io/international/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join("")

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${coreUrls}
  ${verticalUrls}
  ${locationUrls}
  ${stateUrls}
  ${internationalUrls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
